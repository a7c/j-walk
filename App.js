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
import { Container } from 'src/undux/GameStore';

type Props = {};

export default class App extends React.Component<Props> {
  componentDidMount() {
    Font.loadAsync({
      krungthep: require('assets/fonts/krungthep-webfont.ttf'),
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
    Vocab: { screen: VocabScreen },
  },
  {
    cardStyle: { backgroundColor: '#ff8859' },
    headerMode: "none",
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
