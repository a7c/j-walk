/**
 *  @flow
 */

import React from 'react';
import {
  AppRegistry,
  Text,
  View,
  Button,
  Image,
  Animated,
  Easing,
  StyleSheet,
  ListView,
  Platform,
  TouchableHighlight,
} from 'react-native';

import { shuffleArray } from 'src/util/Util';

/**
 *  Component that generates 4 multiple choice answer buttons, one of which is the
 *  correct answer.
 */

type Props = {|
  answer: string,
  formatJp: string => string,
  onCorrectAnswer: void => void,
  onIncorrectAnswer: void => void,
  vocab: Array<string>,
|};

type State = {|
  choices: Array<string>,
|};

export default class Choices extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      choices: this._generateChoices(props.vocab, props.answer),
    };
  }

  /** Returns an array with 4 possible answers. The false answers are randomly generated
   from all learned vocab, and order is randomized. */
  _generateChoices(vocab, answer) {
    let choices = [answer];
    for (let i = 0; i < 3; i++) {
      let rand = vocab[Math.floor(Math.random() * vocab.length)];
      while (choices.indexOf(rand) != -1) {
        rand = vocab[Math.floor(Math.random() * vocab.length)];
      }
      choices.push(rand);
    }
    choices = shuffleArray(choices);
    return choices;
  }

  _renderChoice = (choice: string) => {
    return (
      <TouchableHighlight
        key={choice}
        onPress={
          choice === this.props.answer
            ? this.props.onCorrectAnswer
            : this.props.onIncorrectAnswer
        }
        underlayColor="transparent"
      >
        <Text style={styles.english}>{this.props.formatJp(choice)}</Text>
      </TouchableHighlight>
    );
  };

  // TODO: refactor to reduce repetition
  render() {
    return <View>{this.state.choices.map(this._renderChoice)}</View>;
  }
}

let styles = StyleSheet.create({
  card: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 15,
    // backgroundColor: 'transparent',
    // shadowColor: "black",
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
    // shadowOffset: {
    //   height: 0,
    //   width: 0
    // },
    width: 290,
    height: 290,
  },
  sushi: {
    height: '90%',
    width: '110%',
    top: '5%',
  },
  sushiContainer: {
    backgroundColor: 'transparent',
    top: '50%',
  },
  english: {
    fontFamily: 'kiwano-apple',
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    paddingTop: 15,
  },
  japanese: {
    fontFamily: 'toppan-bunkyu-midashi-gothic',
    fontSize: 45,
    color: '#ff8b7f',
    fontWeight: '700',
    // shadowColor: "white",
    // shadowOpacity: 1.0,
    // shadowRadius: 1,
    // shadowOffset: {
    //   height: 0,
    //   width: 0
    // },
    textAlign: 'center',
  },
});
