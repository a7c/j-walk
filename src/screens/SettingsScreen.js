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

class SettingsScreen extends React.Component<Props> {
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
          <View style={styles.userIdFlex}>
            <TouchableOpacity
              onPress={() =>
                generateID(store)
              }
              style={styles.idButton}
              color="#FFFFFF"
            >
              <Text style={styles.saveText}>Generate ID</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.inputBox}
              // onChangeText={userId => store.set('playerID')(userId)}
              editable={false}
              value={store.get('playerID')}
            />
          </View>
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
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Are you sure you want to clear your data?',
                'This cannot be undone.',
                [
                  {
                    text: 'No',
                    onPress: () => console.log('Data Clear Canceled!'),
                  },
                  {
                    text: 'Yes',
                    onPress: () =>
                      clearData(store)
                  },
                ],
                { cancelable: false }
              )
            }
            style={styles.clearButton}
            color="#FFFFFF"
          >
            <Text style={styles.saveText}>Clear Data</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function clearData(store) {
  store.set('playerID')('')
  store.set('jpDisplayStyle')('KANA')
}

function generateID(store) {
  var id;
  var letter;
  var num;
  const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M',
                    'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  const min = 10;
  const max = 99;

  num = String(Math.round(min + Math.random() * (max - min)));
  letter = alphabet[Math.floor(Math.random()*alphabet.length)];

  id = letter+num;

  console.log("MANGO: "+id)
  store.set('playerID')(id)
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
    marginTop: 15,
    marginLeft: 5,
    width: '30%',
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
    marginTop: 40,
    textAlign: 'center',
    fontFamily: 'krungthep',
    fontSize: 22,
  },
  backButton: {
    width: 70,
    height: 30,
  },
  saveButton: {
    marginTop: 30,
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
  clearButton: {
    marginTop: 15,
    backgroundColor: 'white',
    width: '90%',
    height: 45,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 5,
  },
  idButton: {
    marginTop: 15,
    marginRight: 5,
    backgroundColor: 'white',
    width: '40%',
    height: 45,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 5,
  },
  header: {
    position: 'absolute',
    top: 35,
    left: 20,
  },
  body: {
    marginTop: 40,
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  userIdFlex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
