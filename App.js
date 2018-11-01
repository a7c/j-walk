/**
 * @flow
 */

import { Font } from 'expo';
import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import HomeScreen from 'src/screens/HomeScreen';
import MapScreen from 'src/screens/MapScreen';
import VocabScreen from 'src/screens/VocabScreen';
import ReviewScreen from 'src/screens/ReviewScreen';
import { Container } from 'src/undux/GameStore';

type Props = {};

export default class App extends React.Component<Props> {
  componentDidMount() {
    Font.loadAsync({
      // $FlowFixMe
      'kiwano-apple': require('assets/fonts/KIWANO-APPLE.otf'),
      krungthep: require('assets/fonts/krungthep-webfont.ttf'),
      // $FlowFixMe
      'toppan-bunkyu-midashi-gothic': require('assets/fonts/ToppanBunkyuMidashiGothic-ExtraBold.otf'),
    });
  }

  render() {
    return (
      <Container>
        <AppNavigator />
      </Container>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    Map: { screen: MapScreen },
<<<<<<< HEAD
    Vocab: { screen: VocabScreen },
=======
    Review: { screen: ReviewScreen },
>>>>>>> aab9f9312cde5dce5fffe0eb8aa4f2c9e21de66b
  },
  {
    cardStyle: { backgroundColor: '#ff8859' },
    headerMode: 'none',
    initialRouteName: 'Home',
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
