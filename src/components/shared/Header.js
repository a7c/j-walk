/**
 * @flow
 */

import type { NavigationScreenProp, NavigationState } from 'react-navigation';

import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import React from 'react';
import { getLevelAndExp, getTotalExpTnl } from 'src/util/Util';

type Props = {|
  color?: 'white' | 'black',
  navigation: NavigationScreenProp<NavigationState>,
  playerExp: number,
|};

const Header = (props: Props) => {
  const color = props.color || 'white';
  const [level, exp] = getLevelAndExp(props.playerExp);
  const totalExpTnl = getTotalExpTnl(level);
  const expBar = {
    width: (exp / getTotalExpTnl(level)) * 126,
    height: 12,
    position: 'relative',
    top: 5,
    left: 45,
  };

  const statsStyle = {
    fontFamily: 'kiwano-apple',
    color,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    width: 50,
    height: 30,
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => props.navigation.dispatch(NavigationActions.back())}
      >
        <Image source={images.back[color]} />
      </TouchableOpacity>
      <Text style={statsStyle}>
        {/* need to offset number for kiwano apple font lol */}
        {'LV: ' + (level - 1)}
      </Text>
      <TouchableOpacity
        onPress={() => _onPressExp(level, props.playerExp, totalExpTnl)}
        underlayColor="transparent"
        style={styles.emptyBar}
      >
        <ImageBackground
          source={images.emptyBar[color]}
          style={styles.emptyBar}
        >
          <View>
            <Image style={expBar} source={images.filling[color]} />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const _onPressExp = (level: number, totalExp: number, totalExpTnl: number) => {
  Alert.alert(
    'You are level ' + level,
    'You need ' + (totalExpTnl - totalExp) + ' more exp to level up again!',
    [{ text: 'Sweet!' }]
  );
};

export default Header;

const images = {
  back: {
    white: require('assets/images/text/back.png'),
    black: require('assets/images/text/back_black.png'),
  },
  emptyBar: {
    white: require('assets/images/icons/empty_bar.png'),
    black: require('assets/images/icons/empty_bar_black.png'),
  },
  filling: {
    white: require('assets/images/icons/filling.png'),
    black: require('assets/images/icons/filling_black.png'),
  },
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 35,
    left: 20,
    width: '85%',
    zIndex: 2,
  },
  backButton: {
    width: 70,
    height: 30,
  },
  emptyBar: {
    width: 173.5,
    height: 22,
  },
});
