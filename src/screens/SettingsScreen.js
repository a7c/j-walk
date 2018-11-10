/**
 * @flow
 */

import type {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationState,
} from 'react-navigation';

import type { GameStoreProps } from 'src/undux/GameStore';

import React from 'react';

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Picker,
  Button,
  Alert,
} from 'react-native';

import { StackNavigator, NavigationActions } from 'react-navigation';

import { withStore } from 'src/undux/GameStore';

import { JpDisplayStyle } from 'src/jp/Types';

type Props = {
  ...GameStoreProps,
  navigation: NavigationScreenProp<NavigationState>,
};

type State = {
  // nothing
};

class SettingsScreen extends React.Component<Props, State> {
  static navigationOptions: NavigationScreenConfig<*> = {
    title: 'Settings',
    header: { visible: false },
    gesturesEnabled: false,
  };

  constructor(props: Props) {
    super(props);
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
        <View style={styles.body}>
          <Text style={styles.description}> Set User ID </Text>
          <TextInput
            style={styles.inputBox}
            onChangeText={userId => store.set('playerID')(userId)}
            value={store.get('playerID')}
          />
          <Text style={styles.description}> Set Japanese Display Style </Text>
          <Picker
            selectedValue={store.get('jpDisplayStyle')}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) =>
              store.set('jpDisplayStyle')(itemValue)
            }
            itemStyle={{
              backgroundColor: '#FFA37F',
              fontFamily: 'krungthep',
            }}
          >
            <Picker.Item label="Kana" value="KANA" style={styles.item} />
            <Picker.Item label="Kanji" value="KANJI" style={styles.item} />
            <Picker.Item label="Romaji" value="ROMAJI" style={styles.item} />
          </Picker>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Your settings have been saved!',
                'Return Home?',
                [
                  {
                    text: 'Not Yet',
                    onPress: () => console.log('Cancel Pressed!'),
                  },
                  {
                    text: 'Yes Please!',
                    onPress: () =>
                      navigation.dispatch(NavigationActions.back()),
                  },
                ],
                { cancelable: false }
              )
            }
            style={styles.saveButton}
            color="#FFFFFF"
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default withStore(SettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the whole screen
    alignItems: 'center', // Center button horizontally
    // paddingTop: 22,
  },
  inputBox: {
    backgroundColor: '#FFA37F',
    fontFamily: 'krungthep',
    marginTop: 10,
    width: '90%',
    fontSize: 22,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 5,
    padding: 5,
  },
  picker: {
    marginTop: 10,
    width: '90%',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 5,
  },
  description: {
    marginTop: 50,
    textAlign: 'center',
    fontFamily: 'krungthep',
    fontSize: 22,
  },
  backButton: {
    width: 70,
    height: 30,
  },
  saveButton: {
    marginTop: 50,
    backgroundColor: 'white',
    width: '90%',
    height: 45,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 5,
  },
  saveText: {
    fontFamily: 'krungthep',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 8,
  },
  header: {
    position: 'absolute',
    top: 35,
    left: 20,
  },
  body: {
    marginTop: 50,
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
});
