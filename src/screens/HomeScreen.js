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
  static navigationOptions: NavigationScreenConfig<*> = {
    title: 'Home',
    header: null,
  };

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

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    maxWidth: '80%',
    maxHeight: '187%',
    resizeMode: 'contain',
  },
  imageTitle: {
    width: '100%',
    height: '20%',
    marginTop: '10%',
  },
});
