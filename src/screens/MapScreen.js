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

import { MapView } from 'expo';
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
};

class MapScreen extends React.Component<Props, State> {
  static navigationOptions: NavigationScreenConfig<*> = {
    title: 'Map',
    header: null,
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
    };
  }

  componentDidMount() {
    try {
      this._populateMap();
    } catch (error) {
      console.error(error);
    }
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
    console.log(venues);
  }

  _onRegionChangeComplete = region => {
    this.setState({ region });
  };

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
        </MapView>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.dispatch(NavigationActions.back())}
          >
            <Image source={require('assets/images/text/home.png')} />
          </TouchableOpacity>
        </View>
        <ActivityIndicator animating={isLoading} />
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
    marginBottom: '150%',
    // marginBottom: '143%',
    // marginTop: '10%',
    marginRight: '60%',
  },
});