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
import { shuffleArray } from 'src/Util';

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
    Alert.alert('Correct!');

    const previousWord = this.state.remainingWords[0];
    let newRemaining = this.state.remainingWords.slice(1);

    // if there are no words left, generate a brand new vocab list
    if (newRemaining.length === 0) {
      newRemaining = shuffleArray([...this.props.store.get('learnedVocab')]);
      // avoid giving the same word twice in a row
      if (newRemaining[0] === previousWord) {
        newRemaining.push(newRemaining[0]);
        newRemaining.shift();
      }
    }

    this.setState({
      remainingWords: newRemaining,
    });
  };

  _handleIncorrectAnswer = () => {
    Alert.alert('Incorrect!');
  };

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
    return (
      <View style={{ alignItems: 'center', paddingTop: 40 }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() =>
              this.props.navigation.dispatch(NavigationActions.back())
            }
          >
            <Image source={require('assets/images/text/back.png')} />
          </TouchableOpacity>
        </View>
        {this._renderBody()}
      </View>
    );
  }
}

export default withStore(ReviewScreen);

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 35,
    left: 20,
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
    left: 170,
    top: 25,
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
