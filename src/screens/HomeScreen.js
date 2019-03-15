/**
 * @flow
 */

import type { RelativeImageStub } from 'react-native';
import type {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import type { GameStoreProps } from 'src/undux/GameStore';

import React from 'react';
import {
  Alert,
  AsyncStorage,
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import SentenceDatabase from 'src/async/SentenceDatabase';
import getLogging from 'src/logging/Logging';
import { withStore } from 'src/undux/GameStore';
// TODO: switch this to non-test version during user study?
import { generateTestUserID } from 'src/util/Util';

const logger = getLogging();

// TODO: persistent data

const createButton = (img: RelativeImageStub, onPress: () => void) => {
  return (
    <TouchableOpacity onPress={onPress} underlayColor="transparent">
      <Image source={img} style={styles.image} />
    </TouchableOpacity>
  );
};

type Props = {
  ...GameStoreProps,
  navigation: NavigationScreenProp<NavigationState>,
};

class HomeScreen extends React.Component<Props> {
  _hasLoggedSession = false;

  static navigationOptions: NavigationScreenConfig<*> = {
    title: 'Home',
    header: null,
  };

  componentDidMount() {
    const { store } = this.props;
    let playerID = store.get('playerID');
    if (playerID == null) {
      playerID = generateTestUserID();
      store.set('playerID')(playerID);
    }
    if (!this._hasLoggedSession) {
      this._initLogging(playerID);
    }

    SentenceDatabase.db.load();
  }

  async _initLogging(playerID) {
    console.log('try init logging');
    await AsyncStorage.setItem('user_id', playerID);
    await logger.initialize(
      false /* debug? */,
      false /* suppressConsoleOutput? */
    );
    // treat entire game as one page + one level
    logger.recordPageLoad();
    logger.recordLevelStart(
      'game start',
      this.props.store.get('jpDisplayStyle')
    );
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View>
        <Image
          source={require('assets/images/text/home_title.png')}
          style={styles.imageTitle}
        />
        <View style={styles.container}>
          {createButton(require('assets/images/text/map.png'), () => {
            navigate('Map');
          })}
          {createButton(require('assets/images/text/review.png'), () => {
            navigate('Review');
          })}
          {createButton(require('assets/images/text/vocabulary.png'), () => {
            navigate('Vocab');
          })}
          {createButton(require('assets/images/text/settings.png'), () => {
            navigate('Settings');
          })}
        </View>
      </View>
    );
  }
}

export default withStore(HomeScreen);

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    height: height * 0.15,
    resizeMode: 'contain',
  },
  imageTitle: {
    width: '100%',
    height: height * 0.3,
    marginTop: '10%',
  },
});
