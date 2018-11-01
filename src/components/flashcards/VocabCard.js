/**
 *  @flow
 */

import React from 'react';
import { Text, View, ImageBackground, StyleSheet } from 'react-native';

import { getRandomInt } from 'src/Util';

// TODO: these should be converted to locally stored images
const sushiList = [
  'https://i.imgur.com/M1UZsiT.png', // sushi1 0
  'https://i.imgur.com/gYu7Tar.png', // sushi2 1
  'https://i.imgur.com/Rv0FE4K.png', // sushi3 2
  'https://i.imgur.com/sdncPS9.png', // sushi4 3
  'https://i.imgur.com/aKXArF0.png', // sushi5 4
  'https://i.imgur.com/iqfgbWf.png', // sushi6 5
  'https://i.imgur.com/tJsYDH6.png', // sushi7 6
];

type Props = {
  jp: string,
};

/**
 *  Card component that displays a word.
 */
export default class VocabCard extends React.Component<Props> {
  render() {
    return (
      <View style={styles.card}>
        <ImageBackground
          style={styles.sushi}
          source={{ uri: sushiList[getRandomInt(0, 6)] }}
        >
          <View style={styles.sushiContainer}>
            <Text numberOfLines={2} style={styles.japanese}>
              {this.props.jp}
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
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
