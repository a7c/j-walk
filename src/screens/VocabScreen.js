/**
 * @flow
 */

import type {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationStateRoute,
} from 'react-navigation';

import type { VocabEntry } from 'src/entities/Types';

import type { GameStoreProps } from 'src/undux/GameStore';

import React from 'react';

import {
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
  navigation: NavigationScreenProp<NavigationStateRoute>,
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
          data={Array.from(store.get('learnedVocab'))}
          renderItem={({ item }) => {
            var vocab = store.get('vocabById').get(item);
            if (vocab != undefined) {
              return (
                <Text style={styles.item}>
                  {vocab.id + ' = ' + vocab.english}
                </Text>
              );
            } else {
              console.error(
                'VocabById Key Error when rendering on VocabScreen.js'
              );
            }
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
