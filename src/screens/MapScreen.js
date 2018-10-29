/**
 * @flow
 */

import type {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import type { VocabEntry } from 'src/entities/Types';

import type { GameStoreProps } from 'src/undux/GameStore';

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

import { fetchVenues } from 'src/async/VenueFetcher';

import {
  generateKeywordsForVenueCategory,
  generateVocabForKeyword,
} from 'src/entities/VocabEngine';

import VenueMarker from 'src/map/VenueMarker';

import { withStore } from 'src/undux/GameStore';

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

const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeInterval: 2000, distanceInterval: 1 };

type Props = {
  ...GameStoreProps,
  navigation: NavigationScreenProp<NavigationState>,
};

type State = {
  region: {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number,
  },
  isLoading: boolean,
  location: null,
  errorMessage: string,
  playerPos: {
    latitude: number,
    longitude: number
  },
  playerHeading: number
};

class MapScreen extends React.Component<Props, State> {
  static navigationOptions: NavigationScreenConfig<*> = {
    title: 'Map',
    header: { visible:false },
    gesturesEnabled: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      region: {
        latitude: 42.444782, //42.444977,
        longitude: -76.484187, //-76.481091,
        latitudeDelta: 0.00287,
        longitudeDelta: 0.00131,
      },
      isLoading: false,
      location: null,
      errorMessage: "",
      playerPos: {
        latitude: 0,
        longitude: 0
      },
      playerHeading: 0
    };
    Location.watchPositionAsync({ enableHighAccuracy: true, timeInterval: 2000, distanceInterval: 1 }, this.locationChanged);
    Location.watchHeadingAsync(this.headingChanged);
  }

  componentDidMount() {
    try {
      this._populateMap();
      this._getLocationAsync();
      // Location.watchPositionAsync({ enableHighAccuracy: true, timeInterval: 2000, distanceInterval: 1 }, this.locationChanged);
      // Location.watchHeadingAsync(this.headingChanged);
    } catch (error) {
      console.error(error);
    }
  }

  locationChanged = (location) => {
    this.setState({location});
    this.setState({
      playerPos: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    })
    console.log("UPDATE STATE");
    console.log(this.state.playerPos);
  }

  headingChanged = (heading) => {
    this.setState({
      playerHeading: heading.magHeading
    })
    console.log("UPDATE HEADING");
    console.log(this.state.playerHeading);
  }

  async _populateMap() {
    const { store } = this.props;
    const { region } = this.state;

    this.setState({
      isLoading: true,
    });
    const venues = await fetchVenues(region.latitude, region.longitude, 250);
    const venuesById = new Map(store.get('venuesById'));
    let nearbyVenues = new Set();
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
    for (const venue of venues) {
      const keywords = await generateKeywordsForVenueCategory(
        venuesById,
        venue.id
      );
      for (const keyword of keywords) {
        console.log('keyword: ' + keyword);
        let vocabCandidates = vocabFromKeyword.get(keyword);
        if (!vocabCandidates) {
          const vocabEntries: Array<VocabEntry> = await generateVocabForKeyword(
            keyword
          );
          for (const vocabEntry of vocabEntries) {
            if (!vocabById.has(vocabEntry.id)) {
              vocabById.set(vocabEntry.id, vocabEntry);
            }
          }
          vocabCandidates = vocabEntries.map(entry => entry.id);

          vocabFromKeyword.set(keyword, vocabCandidates);
        }
        console.log(vocabCandidates);

        const vocabForVenue = vocabCandidates.pop();
        if (!vocabForVenue) {
          continue;
        }
        venue.vocab = vocabForVenue;
        break;
      }
    }
    store.set('vocabById')(vocabById);
    store.set('vocabFromKeyword')(vocabFromKeyword);
    // console.log(venues);
  }

  _onRegionChangeComplete = region => {
    this.setState({ region });
  };

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    this.setState({
      playerPos: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    })
    console.log("INITIAL STATE");
    console.log(this.state.location);
  };
  //
  // _updateLocationAsync = async () => {
  //   let location = await Location.watchPositionAsync({
  //     enableHighAccuracy: true,
  //     timeInterval: 5000,
  //     distanceInterval: 5
  //   }, (loc) => {
  //     this.setState({
  //       location: loc
  //     })
  //     console.log("STATE CHANGE")
  //     console.log(this.state.location);
  //   });
  // };

  render() {
    const { navigation, store } = this.props;
    const { isLoading, region } = this.state;

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={this._onRegionChangeComplete}
        >
          {Array.from(store.get('nearbyVenues')).map(venueId => (
            <VenueMarker venueId={venueId} key={venueId} />
          ))}
          <MapView.Marker coordinate={this.state.playerPos}>
            <Image
              source={require('assets/images/map/mon.png')}
              resizeMode={Image.resizeMode.cover}
              style={{
                width: 47,
                height: 40,
                zIndex: 1,
              }}
            />
            <Image
              source={require('assets/images/map/bearingV2.png')}
              resizeMode={Image.resizeMode.cover}
              style={{
                width: 90,
                height: 90,
                zIndex: 0,
                position: "absolute",
                top: -24,
                left: -21,
                transform: [{ rotate: String(this.state.playerHeading)+"deg"}]
              }}
            />
            {/* <Image
              source={require('assets/images/map/bearing.png')}
              resizeMode={Image.resizeMode.cover}
              style={{
                width: 80,
                height: 90,
                zIndex: 0,
                position: "absolute",
                top: -22,
                left: -21,
                transform: [{ rotate: String(this.state.playerHeading)+"deg"}],
              }}
            /> */}
          </MapView.Marker>
        </MapView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.dispatch(NavigationActions.back())}
          >
            <Image source={require('assets/images/text/home.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.loading}>
          <ActivityIndicator animating={isLoading} size="large" color="#FF8859" />
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
  // buttonContainer: {
  //   marginVertical: 20,
  // },
  // button: {
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(255,255,255,0.7)',
  //   borderRadius: 20,
  //   padding: 12,
  //   width: 160,
  // },
  loading: {
    position: 'absolute',
    top: "25%",
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
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
    // marginBottom: '150%',
    // marginBottom: '143%',
    // marginTop: '10%',
    top: "-90%",
    marginRight: '60%',
  },
});
