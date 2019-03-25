/**
 * @flow
 */

import type { RelativeImageStub } from 'react-native';
import type {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationStateRoute,
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
import { withStore } from 'src/undux/GameStore';

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
  navigation: NavigationScreenProp<NavigationStateRoute>,
};

class HomeScreen extends React.Component<Props> {
  _isFirstLoad = true;

  static navigationOptions: NavigationScreenConfig<*> = {
    title: 'Home',
    header: null,
  };

  componentDidMount() {
    const { store } = this.props;

    if (this._isFirstLoad) {
      SentenceDatabase.db.load();
      this.props.navigation.navigate('Settings');
      this._isFirstLoad = false;
    }
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
