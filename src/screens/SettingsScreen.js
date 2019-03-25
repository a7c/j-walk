/**
 * @flow
 */

import type {
  NavigationScreenConfig,
  NavigationScreenProp,
  NavigationStateRoute,
} from 'react-navigation';

import type { JpDisplayStyleType } from 'src/jp/Types';
import type { GameStoreProps } from 'src/undux/GameStore';
import type { PlayModeType } from 'src/util/Types';

import React from 'react';

import {
  AsyncStorage,
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
import getLogging from 'src/logging/Logging';
import { withStore } from 'src/undux/GameStore';
import { PlayMode } from 'src/util/Types';
import { generateUserID, generateTestUserID } from 'src/util/Util';

const logger = getLogging();

type Props = {
  ...GameStoreProps,
  navigation: NavigationScreenProp<NavigationStateRoute>,
};

type State = {
  isTest: boolean,
  jpDisplayStyle: JpDisplayStyleType,
  playMode: PlayModeType,
  playerID: ?string,
};

class SettingsScreen extends React.Component<Props, State> {
  static navigationOptions: NavigationScreenConfig<*> = {
    title: 'Settings',
    header: { visible: false },
    gesturesEnabled: false,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isTest: props.store.get('testIDGenerationBool'),
      jpDisplayStyle: props.store.get('jpDisplayStyle'),
      playMode: props.store.get('playMode'),
      playerID: props.store.get('playerID'),
    };
  }

  render() {
    const { navigation, store } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Image source={require('assets/images/text/home.png')} />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <Text style={styles.description}> User ID </Text>
          <View style={styles.userIdFlex}>
            <Text style={styles.saveText}>Play </Text>
            <Slider
              disabled={!store.get('testIDGenerationBool')}
              style={{ width: 100, marginTop: 10 }}
              step={1}
              value={this.state.isTest ? 1 : 0}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              onValueChange={val =>
                this.setState({
                  isTest: val !== 0,
                })
              }
            />
            <Text style={styles.saveText}> Test</Text>
          </View>
          <View style={styles.userIdFlex}>
            {store.get('testIDGenerationBool') ? (
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    playerID: this.state.isTest
                      ? generateUserID()
                      : generateTestUserID(),
                  })
                }
                style={styles.idButton}
                color="#FFFFFF"
              >
                <Text style={styles.saveText}>Create</Text>
              </TouchableOpacity>
            ) : null}

            <TextInput
              style={styles.inputBox}
              editable={false}
              value={this.state.playerID}
            />
          </View>
          <Text style={styles.description}> Play Mode </Text>
          {store.get('testIDGenerationBool') ? (
            <Picker
              disabled={true}
              selectedValue={this.state.playMode}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                this.setState({
                  playMode: itemValue,
                });
              }}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Roaming" value={PlayMode.ROAMING} />
              <Picker.Item label="Stationary" value={PlayMode.STATIONARY} />
            </Picker>
          ) : (
            <View style={styles.userIdFlex}>
              <TextInput
                style={styles.inputBox}
                editable={false}
                value={store.get('playMode')}
              />
            </View>
          )}
          {/*<Text style={styles.description}> Japanese Display Style </Text>
          <Picker
            selectedValue={this.state.jpDisplayStyle}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({
                jpDisplayStyle: itemValue,
              });
            }}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Kana" value={JpDisplayStyle.KANA} />
            <Picker.Item label="Romaji" value={JpDisplayStyle.ROMAJI} />
          </Picker>*/}
          {store.get('testIDGenerationBool') ? (
            <TouchableOpacity
              onPress={this._onSave}
              style={styles.saveButton}
              color="#FFFFFF"
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          ) : null}
          {/*<TouchableOpacity
            onPress={this._onClearData}
            style={styles.clearButton}
            color="#FFFFFF"
          >
            <Text style={styles.saveText}>Clear Data</Text>
          </TouchableOpacity>*/}
        </View>
      </View>
    );
  }

  _onSave = () => {
    const playerID = this.state.playerID;
    if (!playerID) {
      Alert.alert(
        'Error!',
        'You must generate a player ID before starting the game.'
      );
      return;
    }
    const { store, navigation } = this.props;

    Alert.alert(
      'Are you ready?',
      `Please verify the following settings:
Player ID: ${playerID}
Play Mode: ${this.state.playMode}`,
      [
        {
          text: 'Make Changes',
        },
        {
          text: "Let's Play!",
          onPress: async () => {
            store.set('jpDisplayStyle')(this.state.jpDisplayStyle);
            store.set('playMode')(this.state.playMode);
            store.set('playerID')(playerID);
            store.set('testIDGenerationBool')(this.state.isTest);
            // TODO: log play mode
            // logJpDisplayStyle(this.state.jpDisplayStyle);

            await AsyncStorage.setItem('user_id', playerID);
            await logger.initialize(
              false /* debug? */,
              false /* suppressConsoleOutput? */
            );
            // treat entire game as one page + one level
            logger.recordPageLoad();
            logger.recordLevelStart(0, `${playerID} ${this.state.playMode}`);
            navigation.navigate('Home');
          },
        },
      ],
      { cancelable: false }
    );
  };

  // _onClearData = () =>
  //   Alert.alert(
  //     'Are you sure you want to clear your data?',
  //     'This cannot be undone.',
  //     [
  //       {
  //         text: 'No',
  //       },
  //       {
  //         text: 'Yes',
  //         onPress: () => clearData(this.props.store),
  //       },
  //     ],
  //     { cancelable: false }
  //   );
}

export default withStore(SettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
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
    flexGrow: 1,
  },
  picker: {
    marginTop: 10,
    width: '90%',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 5,
    // height = pickerItem height + borderRadius
    height: 105,
  },
  pickerItem: {
    height: 100,
    backgroundColor: '#FFA37F',
    fontFamily: 'krungthep',
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
