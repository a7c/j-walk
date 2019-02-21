/**
 * @flow
 */

import type { RelativeImageStub } from 'react-native';
// import type {
//   LayoutStyle,
//   TransformStyle,
//   ShadowStyle,
//   ViewStyle,
//   TextStyle,
//   ImageStyle,
//   DangerouslyImpreciseStyle,
// } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import type {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import React from 'react';
import {
  Alert,
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// TODO: logging
import getLogging from './logging/logging';
const logger = getLogging();

// TODO: prompts (kana/romaji, playerId, navType)
// TODO: persistent data

const createButton = (img: RelativeImageStub, onPress: () => void) => {
  return (
    <TouchableOpacity onPress={onPress} underlayColor="transparent">
      <Image source={img} style={styles.image} />
    </TouchableOpacity>
  );
};

type Props = {
  navigation: NavigationScreenProp<NavigationState>,
};

export default class HomeScreen extends React.Component<Props> {
  _hasLoggedSession = false;

  static navigationOptions: NavigationScreenConfig<*> = {
    title: 'Home',
    header: null,
  };

  render() {
    const { navigate } = this.props.navigation;

    // Logging code copied from home.js
    if (this.props.playerId !== "" && !this._hasLoggedSession) {
      this._hasLoggedSession = true;
      AsyncStorage.setItem('user_id', this.props.playerId).then(() => {
        return logger.initialize(DEBUG_MODE, false);
      }).then(() => {
        this.props.dispatch(logAppStart());
      });
    }

    if (this.props.playerId === "") {
      _hasLoggedSession = true;
      AsyncStorage.setItem('user_id', this.props.playerId).then(() => {
        return logger.initialize(DEBUG_MODE, false);
      }).then(() => {
        this.props.dispatch(logAppStart());
      });
    }
    //

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
