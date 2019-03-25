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
import SettingsScreen from 'src/screens/SettingsScreen';
import ChallengeClozeScreen from 'src/screens/ChallengeClozeScreen';
import { Container } from 'src/undux/GameStore';

type Props = {||};

type State = {|
  fontLoaded: boolean,
|};

export default class App extends React.Component<Props, State> {
  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      // $FlowFixMe
      'kiwano-apple': require('assets/fonts/KIWANO-APPLE.otf'),
      krungthep: require('assets/fonts/krungthep-webfont.ttf'),
      // $FlowFixMe
      'toppan-bunkyu-midashi-gothic': require('assets/fonts/ToppanBunkyuMidashiGothic-ExtraBold.otf'),
    });
    this.setState({
      fontLoaded: true,
    });
  }

  render() {
    if (!this.state.fontLoaded) {
      // TODO: better placeholder
      return null;
    }
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
    Review: { screen: ReviewScreen },
    Settings: { screen: SettingsScreen },
    ChallengeCloze: { screen: ChallengeClozeScreen },
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
