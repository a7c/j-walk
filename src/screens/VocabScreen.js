/**
  Map screen.

*/

import type {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import type { VocabEntry } from 'src/entities/Types';

import type { GameStoreProps } from 'src/undux/GameStore';

import React from 'react';

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';

import { StackNavigator, NavigationActions } from 'react-navigation';

import { withStore } from 'src/undux/GameStore';

type Props = {
  ...GameStoreProps,
  navigation: NavigationScreenProp<NavigationState>,
};

type State = {
  // nothing yet
};

class VocabScreen extends React.Component<Props, State> {
  static navigationOptions: NavigationScreenConfig<*> = {
    title: 'Vocab',
    header: { visible: false },
    gesturesEnabled: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      // nothing yet
    };
  }

  render() {
    const { navigation, store } = this.props;
    console.log('MANGO: ' + store.get('learnedVocab').size);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.dispatch(NavigationActions.back())}
          >
            <Image source={require('assets/images/text/home.png')} />
          </TouchableOpacity>
        </View>
        <Text style={styles.item}>
          {"You've learned " + store.get('learnedVocab').size + ' words!'}
        </Text>
        <FlatList
          data={store.get('learnedVocab')}
          renderItem={({ item }) => {
            return (
              <Text style={styles.item}>
                "{formatJapanese(store.get('vocabById').map(item).kana) +
                  ' = ' +
                  store.get('vocabById').map(item).english}"
              </Text>
            );
          }}
          keyExtractor={(item, index) => item}
        />
      </View>
    );
  }
}

export default withStore(VocabScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the whole screen
    alignItems: 'center', // Center button horizontally
    // paddingTop: 22,
  },
  item: {
    fontFamily: 'krungthep',
    marginTop: '20%',
    fontSize: 22,
  },
  backButton: {
    width: 70,
    height: 30,
  },
  header: {
    position: 'absolute',
    top: 35,
    left: 20,
  },
});
