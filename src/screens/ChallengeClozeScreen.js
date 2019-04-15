/**
 * @flow
 */
import type {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationStateRoute,
} from 'react-navigation';

import type { GameStoreProps } from 'src/undux/GameStore';

import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import Choices from 'src/components/flashcards/Choices';
import VocabCard from 'src/components/flashcards/VocabCard';
import Header from 'src/components/shared/Header';
import { VenueState } from 'src/entities/Types';
import { makeJpFormatter } from 'src/jp/Util';
import getLogging from 'src/logging/Logging';
import {
  logFailChallenge,
  logGainExp,
  logPassChallenge,
} from 'src/logging/LogAction';
import { withStore } from 'src/undux/GameStore';
import { EXP_CHALLENGE } from 'src/util/Constants';
import { getLevelAndExp, getTotalExpTnl, shuffleArray } from 'src/util/Util';

const logger = getLogging();

type Props = {|
  ...GameStoreProps,
  navigation: NavigationScreenProp<NavigationStateRoute>,
|};

type State = {|
  anchorWord: string,
  testWordId: string,
  sentence: {
    english: string,
    japanese: string,
  },
  venueId: string,
|};

class ChallengeClozeScreen extends React.Component<Props, State> {
  static navigationOptions: NavigationScreenConfig<*> = {
    title: 'Fill in the Blank',
    header: { visible: false },
    gesturesEnabled: false,
  };

  constructor(props: Props) {
    super(props);

    const { store } = props;
    const learnedVocab = store.get('learnedVocab');

    if (!props.navigation.state.params) {
      throw 'ChallengeClozeScreen requires a string `venueId` navigation param!';
    }
    const { venueId } = props.navigation.state.params;
    if (!venueId || typeof venueId !== 'string') {
      throw 'ChallengeClozeScreen requires a string `venueId` navigation param!';
    }
    const venuesById = store.get('venuesById');
    const venue = venuesById.get(venueId);
    if (!venue) {
      throw 'ChallengeClozeScreen: Invalid venue specified';
    }

    const testWordId = venue.testWordId;
    const anchorWord = venue.anchorWord;
    const sentence = venue.sentence;
    // TODO: can we use the type system to enforce this somehow?
    if (!testWordId || !anchorWord || !sentence) {
      throw 'ChallengeClozeScreen: one or more required venue fields are missing!';
    }

    this.state = {
      testWordId: testWordId,
      anchorWord: anchorWord,
      sentence: sentence,
      venueId: venueId,
    };
  }

  _returnToMap = () => {
    this.props.navigation.dispatch(NavigationActions.back());
  };

  _handleCorrectAnswer = () => {
    const { store } = this.props;

    logGainExp(store.get('playerExp'), EXP_CHALLENGE);
    store.set('playerExp')(store.get('playerExp') + EXP_CHALLENGE);
    logPassChallenge(this.state.testWordId, this.state.venueId);

    const venue = store.get('venuesById').get(this.state.venueId);
    if (venue) {
      venue.state = VenueState.HIDDEN;
      venue.testWordId = null;
      venue.anchorWord = null;
      venue.sentence = null;
    }

    Alert.alert(
      'Correct!',
      "You've gained EXP and more words have been unlocked!",
      [{ text: 'Sweet!', onPress: this._returnToMap }]
    );
  };

  _handleIncorrectAnswer = () => {
    logFailChallenge(this.state.testWordId, this.state.venueId);
    Alert.alert('Incorrect!', "You didn't earn any EXP.", [
      { text: 'Aww...', onPress: this._returnToMap },
    ]);
  };

  _renderBody() {
    const { store } = this.props;
    const vocabById = store.get('vocabById');
    const testWord = vocabById.get(this.state.testWordId);
    if (!testWord) {
      throw 'ChallengeClozeScreen: test word does not exist!';
    }
    let sentenceString = this.state.sentence.japanese;
    sentenceString = sentenceString.replace(testWord.word, '______');

    const learnedVocab = store.get('learnedVocab');
    const japaneseList = [];
    learnedVocab.forEach(vocabId => {
      const vocab = vocabById.get(vocabId);
      if (vocab) {
        japaneseList.push(vocab.reading);
      }
    });

    const hasLearnedTestWord = learnedVocab.has(this.state.testWordId);
    let choices = null;
    if (hasLearnedTestWord) {
      choices = (
        <Choices
          vocab={japaneseList}
          formatJp={makeJpFormatter(store.get('jpDisplayStyle'))}
          answer={testWord.reading}
          onCorrectAnswer={this._handleCorrectAnswer}
          onIncorrectAnswer={this._handleIncorrectAnswer}
        />
      );
    } else {
      choices = (
        <View>
          <Text style={styles.english}>
            You have not yet learnt the word to complete the sentence!
          </Text>
        </View>
      );
    }

    return (
      <React.Fragment>
        <View style={styles.japeng}>
          <Text style={styles.japanese}>{sentenceString}</Text>
          <Text style={styles.english}>{this.state.sentence.english}</Text>
        </View>
        <Text style={styles.english} />
        {hasLearnedTestWord && (
          <Text style={styles.englishHint}>{'(' + testWord.english + ')'}</Text>
        )}
        {choices}
        {!hasLearnedTestWord && (
          <View>
            <Image
              style={styles.unknown}
              source={require('assets/images/icons/unknown_sushi.png')}
            />
            <Text style={styles.englishHint}>
              {'(' + testWord.english + ')'}
            </Text>
          </View>
        )}
      </React.Fragment>
    );
  }

  render() {
    const { navigation, store } = this.props;

    return (
      <View style={styles.root}>
        <Header playerExp={store.get('playerExp')} navigation={navigation} />
        {this._renderBody()}
      </View>
    );
  }
}

export default withStore(ChallengeClozeScreen);

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    paddingTop: 40,
  },
  levelUp: {
    width: 350,
    height: 300,
    top: 100,
    position: 'absolute',
    zIndex: 2,
    opacity: 1,
  },
  english: {
    fontFamily: 'kiwano-apple',
    fontSize: 25,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  japanese: {
    fontFamily: 'toppan-bunkyu-midashi-gothic',
    fontSize: 25,
    textAlign: 'center',
  },
  japeng: {
    backgroundColor: 'white',
    marginTop: 30,
    padding: 20,
  },
  unknown: {
    height: 117,
    width: 185,
    marginTop: 20,
    paddingTop: 50,
    alignSelf: 'center',
    alignItems: 'center',
  },
  englishHint: {
    fontFamily: 'kiwano-apple',
    fontSize: 25,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: 'black',
    backgroundColor: 'transparent',
  },
});
