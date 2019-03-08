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
  Slider,
} from 'react-native';

import { StackNavigator, NavigationActions } from 'react-navigation';

import { JpDisplayStyle } from 'src/jp/Types';
import { logJpDisplayStyle } from 'src/logging/LogAction';
import { withStore } from 'src/undux/GameStore';
import { generateUserID, generateTestUserID } from 'src/util/Util';

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
              onPress={() => generateID(store)}
              style={styles.idButton}
              color="#FFFFFF"
            >
              <Text style={styles.saveText}>Generate ID</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.inputBox}
              editable={false}
              value={store.get('playerID')}
            />
          </View>
          <View style={styles.userIdFlex}>
            <Text style={styles.saveText}>Off </Text>
            <Slider
              style={{ width: 100, marginTop: 10 }}
              step={1}
              value={getTestBool(store)}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              onValueChange={val => setTestBool(store, val)}
            />
            <Text style={styles.saveText}> On</Text>
          </View>
          <Text style={styles.description}> Set Japanese Display Style </Text>
          <Picker
            selectedValue={store.get('jpDisplayStyle')}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => {
              store.set('jpDisplayStyle')(itemValue);
              logJpDisplayStyle(itemValue);
            }}
            itemStyle={{
              backgroundColor: '#FFA37F',
              fontFamily: 'krungthep',
            }}
          >
            <Picker.Item
              label="Kana"
              value={JpDisplayStyle.KANA}
              style={styles.item}
            />
            <Picker.Item
              label="Romaji"
              value={JpDisplayStyle.KANJI}
              style={styles.item}
            />
          </Picker>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Your settings have been saved!',
                'Return Home?',
                [
                  {
                    text: 'Not Yet',
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
                  },
                  {
                    text: 'Yes',
                    onPress: () => clearData(store),
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
  store.set('playerID')('');
  store.set('jpDisplayStyle')('KANA');
}

function setTestBool(store, val) {
  if (val == 0) {
    store.set('testIDGenerationBool')(false);
  } else {
    store.set('testIDGenerationBool')(true);
  }
}

function getTestBool(store) {
  if (store.get('testIDGenerationBool') == false) {
    return 0;
  } else {
    return 1;
  }
}

function generateID(store) {
  if (store.get('testIDGenerationBool')) {
    store.set('playerID')(generateUserID());
  } else {
    store.set('playerID')(generateTestUserID());
  }
}

export default withStore(SettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
    marginTop: 20,
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
