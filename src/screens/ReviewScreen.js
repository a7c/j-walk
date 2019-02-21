/**
 * @flow
 */
import type {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationState,
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
import { makeJpFormatter } from 'src/jp/Util';
import { withStore } from 'src/undux/GameStore';
import { EXP_REVIEW } from 'src/util/Constants';
import { getLevelAndExp, getTotalExpTnl, shuffleArray } from 'src/Util';

//Logging insert from review.js
import getLogging from "../logging/logging";
import { actionToId } from "../util/util";
const logger = getLogging();
//

type Props = {|
  ...GameStoreProps,
  navigation: NavigationScreenProp<NavigationState>,
|};

type State = {|
  // TODO: eventually we will want a smarter way of queuing words to review
  remainingWords: Array<string>,
  notEnoughWords: boolean,
|};

class ReviewScreen extends React.Component<Props, State> {
  static navigationOptions: NavigationScreenConfig<*> = {
    title: 'Review',
    header: { visible: false },
    gesturesEnabled: false,
  };

  constructor(props: Props) {
    super(props);

    const { store } = props;
    const learnedVocab = store.get('learnedVocab');

    const remainingWords = shuffleArray([...learnedVocab]);

    this.state = {
      remainingWords,
      notEnoughWords: learnedVocab.size < 4,
    };
  }

  _handleCorrectAnswer = () => {
    const { store } = this.props;
    const { remainingWords } = this.state;
    Alert.alert('Correct!');

    const previousWord = remainingWords[0];
    let newRemaining = remainingWords.slice(1);

    // if there are no words left, generate a brand new vocab list
    if (newRemaining.length === 0) {
      newRemaining = shuffleArray([...store.get('learnedVocab')]);
      // avoid giving the same word twice in a row
      if (newRemaining[0] === previousWord) {
        newRemaining.push(newRemaining[0]);
        newRemaining.shift();
      }
    }

    this.setState({
      remainingWords: newRemaining,
    });

    store.set('playerExp')(store.get('playerExp') + EXP_REVIEW);
  };

  _handleIncorrectAnswer = () => {
    //Logging insert from review.js
    logger.recordEvent(actionToId("REVIEW_WRONG"),
      this.props.vocabById[this.state.remainingWords[0]].id);
    //
    Alert.alert('Incorrect!');
  };

  _onPressExp = () => {};

  _renderBody() {
    if (this.state.notEnoughWords) {
      return (
        <Text style={styles.english}>
          {/* actually 4 but kiwano apple font is weird af */}
          Not enough words collected! Need at least 3 words in order to review.
        </Text>
      );
    }
    const { store } = this.props;
    const vocabById = store.get('vocabById');
    const vocab = vocabById.get(this.state.remainingWords[0]);
    // TODO: properly handle null case
    if (vocab == null) {
      return <div />;
    }
    const formatJp = makeJpFormatter(store.get('jpDisplayStyle'));
    const japanese = formatJp(vocab.reading);
    const english = vocab.english;
    const learnedVocab = store.get('learnedVocab');
    const englishList = [...learnedVocab]
      .map(vocabId => {
        const v = vocabById.get(vocabId);
        return v ? v.english : null;
      })
      .filter(Boolean);

    return (
      <React.Fragment>
        <VocabCard jp={japanese} />
        <Choices
          answer={english}
          key={english}
          formatJp={formatJp}
          vocab={englishList}
          onCorrectAnswer={this._handleCorrectAnswer}
          onIncorrectAnswer={this._handleIncorrectAnswer}
        />
      </React.Fragment>
    );
  }

  render() {
    const { navigation, store } = this.props;
    const [level, exp] = getLevelAndExp(store.get('playerExp'));
    const expBar = {
      width: (exp / getTotalExpTnl(level)) * 126,
      height: 12,
      position: 'relative',
      top: 5,
      left: 45,
    };

    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.dispatch(NavigationActions.back())}
          >
            <Image source={require('assets/images/text/back.png')} />
          </TouchableOpacity>
          <Text style={styles.stats}>
            {/* need to offset number for kiwano apple font lol */}
            {'LV: ' + (level - 1)}
          </Text>
          <TouchableOpacity
            onPress={() => {} /* TODO */}
            underlayColor="transparent"
            style={styles.emptyBar}
          >
            <ImageBackground
              source={require('assets/images/icons/empty_bar.png')}
              style={styles.emptyBar}
            >
              <View>
                <Image
                  style={expBar}
                  source={require('assets/images/icons/filling.png')}
                />
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        {this._renderBody()}
      </View>
    );
  }
}

export default withStore(ReviewScreen);

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 35,
    left: 20,
    width: '85%',
    zIndex: 2,
  },
  backButton: {
    width: 70,
    height: 30,
  },
  stats: {
    fontFamily: 'kiwano-apple',
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    width: 50,
    height: 30,
  },
  emptyBar: {
    width: 173.5,
    height: 22,
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
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    paddingTop: 15,
  },
});
