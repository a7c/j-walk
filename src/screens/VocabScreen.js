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
    header: { visible:false },
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
        {/* <Text style={styles.item}>
          {'Words learned: ' + this.props.learnedVocab.list.length}
        </Text>
        <FlatList
          data={this.props.learnedVocab.list}
          renderItem={({item}) => {
            return (<Text style={styles.item}>
              {formatJapanese(this.props.vocabById[item].kana) + " = " + this.props.vocabById[item].english}
            </Text>);
          }}
          keyExtractor={(item, index) => item}
        /> */}
      </View>
    );
  }
}

export default withStore(VocabScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,                            // Take up the whole screen
    alignItems: 'center',               // Center button horizontally
    paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  backButton: {
    width: 70,
    height: 30,
  },
  header: {
    position: "absolute",
    top: 35,
    left: 20
  },
});
