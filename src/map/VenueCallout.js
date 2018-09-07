/**
 *  @flow
 */

import type { Venue } from 'src/entities/Types';
import type { GameStoreProps } from 'src/undux/GameStore';

import { MapView } from 'expo';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { withStore } from 'src/undux/GameStore';

type Props = {|
  ...GameStoreProps,
  venueId: string,
|};

type State = {||};

class VenueCallout extends React.Component<Props, State> {
  _venue: Venue;

  constructor(props: Props) {
    super(props);
    const { store, venueId } = props;

    const venue: ?Venue = store.get('venuesById').get(venueId);
    if (venue) {
      this._venue = venue;
    } else {
      throw new Error(
        `Tried to init VenueCallout with invalid venue id ${venueId}`
      );
    }
  }

  // TODO: support vocab
  render() {
    const venueNameText = <Text style={styles.name}>{this._venue.name}</Text>;
    const categoryText = (
      <Text style={styles.name}>{this._venue.category}</Text>
    );

    // TODO: callout button

    return (
      <MapView.Callout tooltip style={styles.callout}>
        <View style={styles.container}>
          <View style={styles.bubble}>
            <Text style={styles.venue}>{venueNameText}</Text>
            <Text style={styles.category}>{categoryText}</Text>
          </View>
          <View style={styles.arrowBorder} />
          <View style={styles.arrow} />
        </View>
      </MapView.Callout>
    );
  }
}

export default withStore(VenueCallout);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
  },
  // callout: {
  //   zIndex: 4,
  //   // position: 'relative',
  // },
  // Callout bubble
  bubble: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    alignContent: 'center',
    backgroundColor: '#ff8859',
    borderRadius: 6,
    borderColor: 'transparent',
    borderWidth: 0,
    paddingLeft: 15,
    paddingRight: 15,
    width: 210,
    height: 150,
    zIndex: 1,
  },
  bubbleLOCKED: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    flexWrap: 'wrap',
    backgroundColor: '#CC3A00',
    borderRadius: 6,
    borderColor: '#7E2400',
    borderWidth: 6,
    paddingLeft: 15,
    paddingRight: 15,
    width: 210,
    height: 160,
    zIndex: 1,
  },
  challenge: {
    opacity: 0,
  },
  challengeLOCKED: {
    opacity: 1,
    fontFamily: 'krungthep',
    // width: 180,
    height: 25,
    fontSize: 20,
    textAlign: 'center',
    color: '#ff8859',
    backgroundColor: 'transparent',
    // right: 6,
    marginTop: 5,
    marginBottom: 5,
  },
  venue: {
    fontFamily: 'krungthep',
    width: 180,
    height: 25,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  venueLOCKED: {
    fontFamily: 'krungthep',
    width: 180,
    height: 25,
    right: 6,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  category: {
    fontFamily: 'krungthep',
    width: 180,
    height: 25,
    textAlign: 'center',
    backgroundColor: 'white',
    color: '#ff8859',
  },
  categoryLOCKED: {
    fontFamily: 'krungthep',
    width: 180,
    height: 25,
    right: 6,
    textAlign: 'center',
    backgroundColor: 'white',
    color: '#ff8859',
  },
  kana: {
    fontFamily: 'Toppan Bunkyu Midashi Gothic',
    color: 'white',
    paddingTop: 15,
    width: 180,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#ff8859',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowLOCKED: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#7E2400',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
  },
  arrowBorderLOCKED: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
  },
  // Character name
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  // Character image
  image: {
    width: 120,
    height: 80,
  },
});
