/**
 * @format
 */

import {AppRegistry} from 'react-native';
import React, {Component} from 'react';
import {Button, SafeAreaView, StyleSheet, Alert, Text} from 'react-native';

//Importing the installed libraries
import * as FS from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import MainScreen from './src/screens/MainScreen';
import ShowImageScreen from './src/screens/ShowImageScreen';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cameraRollPer: null,
      disableButton: false,
    };
  }
  async componentDidMount() {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    this.setState((state, props) => {
      return {
        cameraRollPer: status === 'granted',
        disableButton: false,
      };
    });
  }
  isSimulator() {
    // https://github.com/react-native-community/react-native-device-info#isemulator
    return DeviceInfo.isEmulator();
  }

  showAlert = () =>
    Alert.alert(
      'Connection Problem',
      'Internet or Server Problem ',
      [
        {
          text: 'Try Again',
          onPress: () => {
            this.resetData();
          },
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          this.resetData();
        },
      },
    );

  // uriToBase64 = async uri => {
  //   let base64 = await FS.readAsStringAsync(uri, {
  //     encoding: FS.EncodingType.Base64,
  //   });
  //   return base64;
  // };
  uriToBase64 = async uri => {
    console.log('URI:', uri);
    try {
      let base64 = await FS.readAsStringAsync(uri, {
        encoding: FS.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error reading file:', error);
      // Xử lý lỗi ở đây
      return null;
    }
  };

  pickMedia = async () => {
    this.setState((state, props) => {
      return {
        cameraRollPer: state.cameraRollPer,
        disableButton: true,
      };
    });
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
    });
    if (result.cancelled) {
      console.log('there is nothing');
      return;
    }
    console.log('result:', result);
    if (result.assets === null) {
      return;
    }
    if (result.type === 'Images') {
      console.log('Image');
      await this.toServer({
        type: result.assets[0].type,
        base64: result.assets[0].base64,
        uri: result.assets[0].uri,
      });
    } else {
      //console.log('URI:', result.uri);
      let base64 = await this.uriToBase64(result.assets[0].uri);
      await this.toServer({
        type: result.assets[0].type,
        base64: base64,
        uri: result.assets[0].uri,
      });
    }
  };

  toServer = async mediaFile => {
    let type = mediaFile.type;
    let schema = 'http://';
    //let host = '';
    // if (this.isSimulator()) {
    //   host = '10.0.2.2';
    // } else {
    //   host = '127.0.0.1';
    // }
    let host = 'wuan.pythonanywhere.com';
    let route = '';
    let url = '';
    let content_type = '';
    type === 'image'
      ? ((route = '/image'), (content_type = 'image/jpeg'))
      : ((route = '/video'), (content_type = 'video/mp4'));
    url = schema + host + route;
    console.log(url);
    let response = null;
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        'Content-Type': content_type,
      },
      data: mediaFile.base64,
    };

    try {
      response = await axios.request(config).then(
        () => console.log('Done'),
        e => console.log(e),
      );
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <MainScreen/>
      // <SafeAreaView style={styles.container}>
      //   {this.state.cameraRollPer ? (
      //     <Button
      //       title="Pick From Gallery"
      //       disabled={this.state.disableButton}
      //       onPress={async () => {
      //         await this.pickMedia();
      //         this.setState((s, p) => {
      //           return {
      //             cameraRollPer: s.cameraRollPer,
      //             disableButton: false,
      //           };
      //         });
      //       }}
      //     />
      //   ) : (
      //     <Text>Camera Roll Permission Required ! </Text>
      //   )}
      // </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

AppRegistry.registerComponent('DoAn1Test', () => App);
