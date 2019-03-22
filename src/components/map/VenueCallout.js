/**
 *  @flow
 */

import type {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationStateRoute,
} from 'react-navigation';

import type { Venue } from 'src/entities/Types';
import type { GameStoreProps } from 'src/undux/GameStore';

import { MapView } from 'expo';
import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

import { VenueState } from 'src/entities/Types';
import { makeJpFormatter } from 'src/jp/Util';
import { logLearnVocabFromVenue } from 'src/logging/LogAction';
import { withStore } from 'src/undux/GameStore';

type Props = {|
  ...GameStoreProps,
  navigation: NavigationScreenProp<NavigationStateRoute>,
  canInteract: boolean,
  hideCallout: void => void,
  venueId: string,
|};

type State = {||};

class VenueCallout extends React.Component<Props, State> {
  _venue: Venue;
  _formatJp: string => string;

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

    this._formatJp = makeJpFormatter(store.get('jpDisplayStyle'));
  }

  _onLearnPressed = () => {
    const { store, venueId } = this.props;
    const vocabById = store.get('vocabById');
    if (!this._venue.vocab) {
      throw new Error("Cannot learn if there's no vocab!");
    }
    const vocab = vocabById.get(this._venue.vocab);
    if (!vocab) {
      throw new Error(
        "Tried to learn a vocab word but the corresponding ID doesn't exist!"
      );
    }

    const learnedVocab = store.get('learnedVocab');
    const newLearnedVocab = new Set(learnedVocab).add(vocab.id);
    store.set('learnedVocab')(newLearnedVocab);
    logLearnVocabFromVenue(vocab.id, venueId);

    this._venue.state = VenueState.HIDDEN;
    store.set('venuesById')(new Map(store.get('venuesById')));

    const vocabText = `${this._formatJp(vocab.reading)}\n${vocab.english}`;
    Alert.alert(`Learned a new word!`, `${vocabText}`);
  };

  _onUnlockPressed = () => {
    this.props.navigation.navigate('ChallengeCloze', {
      venueId: this.props.venueId,
    });
    this.props.hideCallout();
  };

  render() {
    const { canInteract, store } = this.props;
    const vocabById = store.get('vocabById');

    const venueNameText = <Text style={styles.name}>{this._venue.name}</Text>;
    const categoryText = (
      <Text style={styles.name}>{this._venue.category}</Text>
    );

    let vocabReading = null;
    if (this._venue.state === VenueState.LEARN && this._venue.vocab) {
      const vocab = vocabById.get(this._venue.vocab);
      if (vocab) {
        vocabReading = this._formatJp(vocab.reading);
      }
    }

    const button = canInteract ? (
      this._venue.state === VenueState.LEARN ? (
        <Button onPress={this._onLearnPressed} title={'Learn'} />
      ) : (
        <Button onPress={this._onUnlockPressed} title={'Unlock'} />
      )
    ) : (
      <Button disabled={true} onPress={() => {}} title={'Too far!'} />
    );

    return (
      <MapView.Callout tooltip style={styles.callout}>
        <View style={styles.container}>
          <View style={styles.bubble}>
            <Text style={styles.venue}>{venueNameText}</Text>
            <Text style={styles.category}>{categoryText}</Text>
            <Text style={styles.kana}>{vocabReading}</Text>
            {button}
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
    height: 170,
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
    marginTop: 15,
    width: 180,
    height: 25,
    textAlign: 'center',
    backgroundColor: 'white',
    flexGrow: 0.2,
    flex: 0,
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
    fontFamily: 'toppan-bunkyu-midashi-gothic',
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
