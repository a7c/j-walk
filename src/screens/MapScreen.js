/**
 * @flow
 */

import type {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationStateRoute,
} from 'react-navigation';
import type { Venue, VocabEntry } from 'src/entities/Types';
import type { GameStoreProps } from 'src/undux/GameStore';
import type { CancellablePromise } from 'src/util/Util';

import { MapView, Location, Permissions } from 'expo';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';

import SentenceDatabase from 'src/async/SentenceDatabase';
import { fetchVenues } from 'src/async/VenueFetcher';
import { VenueState } from 'src/entities/Types';
import {
  generateKeywordsForVenueCategory,
  generateVocabForKeyword,
} from 'src/entities/VocabEngine';
import AvatarMarker from 'src/components/map/AvatarMarker';
import VenueMarker from 'src/components/map/VenueMarker';
import Header from 'src/components/shared/Header';
import { logAttachVocabToVenue, logPosition } from 'src/logging/LogAction';
import { withStore } from 'src/undux/GameStore';
import { CHALLENGE_VENUE_RATIO } from 'src/util/Constants';
import { cancellablePromise, getLevel } from 'src/util/Util';
import { PlayMode } from 'src/util/Types';

// adapted from https://stackoverflow.com/a/21623206
const getDistanceFromLatLng = (coords1, coords2) => {
  const lat1 = coords1.latitude;
  const lon1 = coords1.longitude;
  const lat2 = coords2.latitude;
  const lon2 = coords2.longitude;

  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  return 12742 * Math.asin(Math.sqrt(a)) * 1000; // 2 * R; R = 6371 km
};

const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeInterval: 2000,
  distanceInterval: 1,
};

const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = 0.002;

type Region = {|
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
|};

const DEFAULT_REGION = {
  latitude: 42.445025,
  longitude: -76.481233,
  latitudeDelta: 0.00287,
  longitudeDelta: 0.00131,
};

/* at level 1, the player must be this close to a venue in order to interact
 * with it (in meters) */
const DEFAULT_INTERACT_RADIUS = 50;
/* buffer distance added to interact radius so players can interact with
 * venues even if they're not quite close enough */
const INTERACT_RADIUS_BUFFER = 10;

type Props = {
  ...GameStoreProps,
  navigation: NavigationScreenProp<NavigationStateRoute>,
};

type State = {
  isLoading: boolean,
  errorMessage: string,
  playerPos: {
    latitude: number,
    longitude: number,
  },
  playerHeading: number,
  region: Region,
};

class MapScreen extends React.Component<Props, State> {
  _headingSubscription = null;
  _map = null;
  _pendingPromises: Array<CancellablePromise<any>> = [];
  _positionSubscription = null;

  static navigationOptions: NavigationScreenConfig<*> = {
    title: 'Map',
    header: { visible: false },
    gesturesEnabled: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false,
      errorMessage: '',
      playerPos: {
        latitude: 0,
        longitude: 0,
      },
      playerHeading: 0,
      region: DEFAULT_REGION,
    };

    if (this.props.store.get('playMode') === PlayMode.ROAMING) {
      Location.watchPositionAsync(
        { enableHighAccuracy: true, timeInterval: 2000, distanceInterval: 1 },
        this._onLocationChanged
      ).then(subscription => (this._positionSubscription = subscription));
      Location.watchHeadingAsync(this._onHeadingChanged).then(
        subscription => (this._headingSubscription = subscription)
      );
    }
  }

  componentDidMount() {
    try {
      this._getLocationAsync(this._populateMap);
    } catch (error) {
      console.error(error);
    }
  }

  componentWillUnmount() {
    this._pendingPromises.map(p => p.cancel());
    if (this._positionSubscription) {
      this._positionSubscription.remove();
    }
    if (this._headingSubscription) {
      this._headingSubscription.remove();
    }
  }

  /** This cancellable promise infrastructure allows us to cancel pending
   *  promises when the component unmounts. */
  _addPromise = promise => {
    this._pendingPromises = [...this._pendingPromises, promise];
  };

  _removePromise = promise => {
    this._pendingPromises = this._pendingPromises.filter(p => p !== promise);
  };

  _wrapPromise = <T>(promise: Promise<T>): Promise<T> => {
    const wrappedPromise = cancellablePromise(promise);
    this._pendingPromises = [...this._pendingPromises, wrappedPromise];
    return wrappedPromise.promise.finally(_ => {
      this._pendingPromises = this._pendingPromises.filter(
        p => p !== wrappedPromise
      );
      return promise;
    });
  };

  _onLocationChanged = location => {
    this.setState({
      playerPos: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  };

  _onHeadingChanged = heading => {
    this.setState({
      playerHeading: heading.magHeading,
    });
  };

  _populateMap = async () => {
    const { store } = this.props;
    const { playerPos } = this.state;

    this.setState({
      isLoading: true,
    });
    const venues = await this._wrapPromise(
      fetchVenues(playerPos.latitude, playerPos.longitude, 250)
    );
    const venuesById = new Map(store.get('venuesById'));
    const nearbyVenues = new Set(store.get('nearbyVenues'));
    for (const venue of venues) {
      if (!venuesById.has(venue.id)) {
        venuesById.set(venue.id, venue);
      }
      nearbyVenues.add(venue.id);
    }
    store.set('venuesById')(venuesById);
    store.set('nearbyVenues')(nearbyVenues);
    this.setState({
      isLoading: false,
    });

    const vocabById = new Map(store.get('vocabById'));
    const vocabFromKeyword = new Map(store.get('vocabFromKeyword'));
    Promise.all(
      venues.map(async venue => {
        const keywords = await this._wrapPromise(
          generateKeywordsForVenueCategory(venuesById, venue.id)
        );
        for (const keyword of keywords) {
          let vocabCandidates = vocabFromKeyword.get(keyword);
          if (!vocabCandidates) {
            // TODO: can we parallelize this better instead of awaiting in a loop?
            const vocabEntries: Array<VocabEntry> = await this._wrapPromise(
              generateVocabForKeyword(keyword)
            );
            for (const vocabEntry of vocabEntries) {
              if (!vocabById.has(vocabEntry.id)) {
                vocabById.set(vocabEntry.id, vocabEntry);
              }
            }
            vocabCandidates = vocabEntries.map(entry => entry.id);

            vocabFromKeyword.set(keyword, vocabCandidates);
          }

          const vocabForVenue = vocabCandidates.pop();
          if (!vocabForVenue) {
            continue;
          }
          venue.vocab = vocabForVenue;
          venue.state = VenueState.LEARN;
          // Set the venues again here to make sure map gets re-rendered
          // after each venue is ready
          store.set('venuesById')(new Map(venuesById));
          logAttachVocabToVenue(vocabForVenue, venue.id);
          break;
        }
      })
    ).then(() => {
      store.set('vocabById')(vocabById);
      store.set('vocabFromKeyword')(vocabFromKeyword);

      const nearbyVenuesArray = Array.from(nearbyVenues);
      const numChallenges =
        nearbyVenuesArray.reduce((acc, venueId) => {
          const venue = venuesById.get(venueId);
          if (venue) {
            if (venue.state === VenueState.LOCKED) {
              return acc + 1;
            } else {
              return acc;
            }
          }
        }, 0) || 0;
      if (numChallenges < CHALLENGE_VENUE_RATIO * nearbyVenues.size) {
        const challengeVenueId =
          nearbyVenuesArray[Math.floor(Math.random() * nearbyVenues.size)];
        const challengeVenue = venuesById.get(challengeVenueId);
        if (challengeVenue) {
          this._createChallengeVenue(
            challengeVenue,
            nearbyVenues,
            venuesById,
            vocabById
          );
        }
      }
    });
  };

  _createChallengeVenue = async (
    challengeVenue: Venue,
    nearbyVenues: Set<string>,
    venuesById: Map<string, Venue>,
    vocabById: Map<string, VocabEntry>
  ) => {
    const { store } = this.props;
    let found = false;
    for (const nearbyVenueId of nearbyVenues) {
      if (found) {
        break;
      }
      const nearbyVenue = venuesById.get(nearbyVenueId);
      if (!nearbyVenue) {
        continue;
      }
      const vocabId1 = nearbyVenue.vocab;
      if (!vocabId1 || vocabId1 === challengeVenue.vocab) {
        continue;
      }
      const vocab1 = vocabById.get(vocabId1);
      if (!vocab1) {
        continue;
      }

      for (const vocabId2 of store.get('learnedVocab')) {
        if (found) {
          break;
        }
        if (!vocabId2) {
          continue;
        }
        const vocab2 = vocabById.get(vocabId2);
        if (!vocab2) {
          continue;
        }
        if (vocab1.word === vocab2.word) {
          continue;
        }

        const results = SentenceDatabase.db.queryJapaneseKeywords(
          vocab1.word,
          vocab2.word
        );
        if (results) {
          const pastSentences = store.get('pastSentences');
          results.each((entry, _number) => {
            if (found || pastSentences.has(entry.japanese)) {
              return;
            }
            // TODO: store and check past sentences?
            console.log('found sentence:', entry);
            found = true;
            const sentence = {
              english: entry.english,
              japanese: entry.japanese,
            };
            challengeVenue.state = VenueState.LOCKED;
            challengeVenue.sentence = sentence;
            challengeVenue.anchorWord = vocab2.word;
            challengeVenue.testWordId = vocabId1;
            store.set('venuesById')(venuesById);
            pastSentences.add(sentence.japanese);
            store.set('pastSentences')(pastSentences);
          });
        }
      }
    }
  };

  _setRegion(region: Region) {
    const map = this._map;
    if (map) {
      setTimeout(() => map.animateToRegion(region), 10);
    }
    this.setState({
      region: region,
    });
  }

  _getLocationAsync = async callback => {
    let { status } = await this._wrapPromise(
      Permissions.askAsync(Permissions.LOCATION)
    );
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await this._wrapPromise(
      Location.getCurrentPositionAsync({})
    );
    logPosition(location.coords.latitude, location.coords.longitude);

    this.setState({
      playerPos: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
    this._setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
    await this._wrapPromise(callback());
  };

  _getInteractRadius = () => {
    return (
      DEFAULT_INTERACT_RADIUS + 5 * getLevel(this.props.store.get('playerExp'))
    );
  };

  _isVenueInRange = venueId => {
    const venue = this.props.store.get('venuesById').get(venueId);
    if (!venue) {
      return false;
    }
    const coords = {
      latitude: venue.lat,
      longitude: venue.lng,
    };
    const BUFFER = 10;
    return (
      getDistanceFromLatLng(this.state.playerPos, coords) <
      this._getInteractRadius() + INTERACT_RADIUS_BUFFER
    );
  };

  _onRegionChangeComplete = region => {
    this.setState({
      region: region,
    });
    if (this.props.store.get('playMode') === PlayMode.STATIONARY) {
      this.setState({
        playerPos: {
          latitude: region.latitude,
          longitude: region.longitude,
        },
      });
    }
  };

  render() {
    const { navigation, store } = this.props;
    const { isLoading } = this.state;

    return (
      <View style={styles.container}>
        <MapView
          ref={map => (this._map = map)}
          style={styles.map}
          initialRegion={DEFAULT_REGION}
          onRegionChangeComplete={this._onRegionChangeComplete}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <AvatarMarker
            playerExp={store.get('playerExp')}
            playMode={store.get('playMode')}
            position={this.state.playerPos}
            heading={this.state.playerHeading}
            region={this.state.region}
          />
          {Array.from(store.get('nearbyVenues')).map(venueId => (
            <VenueMarker
              venueId={venueId}
              key={venueId}
              navigation={this.props.navigation}
              inRange={this._isVenueInRange(venueId)}
            />
          ))}
        </MapView>
        <Header
          color={'black'}
          playerExp={store.get('playerExp')}
          navigation={navigation}
        />
        <View style={styles.loading}>
          <ActivityIndicator
            animating={isLoading}
            size="large"
            color="#FF8859"
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={this._populateMap}>
            <Image
              style={styles.refreshButton}
              source={require('assets/images/map/search_button.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default withStore(MapScreen);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, // Take up the whole screen
    justifyContent: 'flex-end', // Arrange button at the bottom
    alignItems: 'center', // Center button horizontally
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loading: {
    position: 'absolute',
    top: '25%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  callout: {
    width: 140,
    //position: 'relative',
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  houseClick: {
    color: 'black',
  },
  backButton: {
    width: 70,
    height: 30,
  },
  refreshButton: {
    width: 204,
    height: 53,
  },
  header: {
    top: '-90%',
    marginRight: '60%',
  },
});
