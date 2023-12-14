/* eslint-disable prettier/prettier */
//import liraries
import React, {Component, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {IMG_CAMERA, IMG_HISTORY, IMG_UPLOAD} from '../assets/images';
import FONTS from '../constants/font';
import {COLORS} from '../constants/color';
import * as FS from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import DeviceInfo from 'react-native-device-info';
import axios from 'axios';

// create a component
const MainScreen = ({props, route, navigation}) => {
  const [cameraRollPer, setCameraRollPer] = useState(null);
  const [disableButton, setDisableButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLoading, setTimeLoading] = useState(0);
  const countRef = useRef(null);
  const UploadImage = async () => {
    setIsLoading(true);
    countRef.current = setInterval(() => {
      setTimeLoading((timeLoading) => timeLoading + 1)
    }, 1000)
    setTimeLoading(0);
    await pickMedia()
      .then (setCameraRollPer(cameraRollPer)) 
      .then (setDisableButton(false))
  };

  const UploadVideo = () => {
    Alert.alert('Upload');
  };

  const uriToBase64 = async uri => {
    console.log('URI:', uri);
    try {
      let base64 = await FS.readAsStringAsync(uri, {
        encoding: FS.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.log('Error reading file:', error);
      Alert.alert('Lỗi video', 'Rất tiếc không thể sử dụng video này, vui lòng đổi sang file khác');
      // Xử lý lỗi ở đây
      return null;
    }
  };

  const pickMedia = async () => {
    setCameraRollPer(cameraRollPer), setDisableButton(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
    });
    if (result.canceled) {
      console.log('there is nothing');
      setIsLoading(false);
      clearInterval(countRef.current);
      setTimeLoading(0);
      return;
    }
    // console.log('result:', result);
    if (result.assets === null) {
      return;
    }
    if (result.assets[0].type === 'image') {
      console.log(result);
      await toServer({
        type: result.assets[0].type,
        base64: result.assets[0].base64,
        uri: result.assets[0].uri,
      });
    } else {
      console.log(result.assets[0].type + " false");
      let base64 = await uriToBase64(result.assets[0].uri);
      await toServer({
        type: result.assets[0].type,
        base64: base64,
        uri: result.assets[0].uri,
      });
    }
  };

  const toServer = async mediaFile => {
    let type = mediaFile.type;
    let schema = 'http://';
    //let host = '';
    // if (this.isSimulator()) {
    //   host = '10.0.2.2';
    // } else {
    //   host = '127.0.0.1';
    // }
    let host = 'flaskapiserver.onrender.com';
    let route = '';
    let url = '';
    let content_type = '';
    type === 'image'
      ? ((route = '/image'), (content_type = 'image/jpeg'))
      : ((route = '/video'), (content_type = 'video/mp4'));
    url = schema + host + route;
    console.log(url);
    //let response = null;
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        'Content-Type': content_type,
      },
      data: mediaFile.base64,
    };

    axios({
      url: url,
      method: 'post',
      data: config.data,
      headers: config.headers,
      responseType: 'text',
    })
      .then(response => {
        // do something
        console.log(response.data);
        navigation.navigate('ShowScreen', {dataType: 'video', data: response.data, content_type: content_type});
        setIsLoading(false);
        clearInterval(countRef.current);
        setTimeLoading(0);
      })
      .catch(error => {
        console.log(error);
        Alert.alert('Lỗi tải file',"Quá trình tải file lên server gặp lỗi, vui lòng thử lại\nStatus code: " + error);
        setIsLoading(false);
        clearInterval(countRef.current);
        setTimeLoading(0);
      });
  };

  useEffect(() => {
    //const status = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setCameraRollPer(true), setDisableButton(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          height: 50,
          width: '100%',
          marginTop: 20,
          alignItems: 'flex-end',
        }}>
        {/* <TouchableOpacity>
          <Image source={IMG_HISTORY} style={styles.historyImage} />
        </TouchableOpacity> */}
      </View>
      <View style={styles.mainView}>
        <TouchableOpacity
          style={!isLoading ? styles.button : [styles.button, {backgroundColor: 'gray'}]}
          onPress={UploadImage}
          disabled={isLoading}>
          <Text style={styles.text}>Upload File</Text>
          <Image style={styles.buttonImage} source={IMG_UPLOAD} />
        </TouchableOpacity>
        <TouchableOpacity style={!isLoading ? styles.button : [styles.button, {backgroundColor: 'gray'}]} 
                          onPress={UploadVideo} 
                          disabled={isLoading}>
          <Text style={styles.text}>Use Camera</Text>
          <Image style={styles.buttonImage} source={IMG_CAMERA} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.waitingText, {opacity: isLoading ? 1 : 0}]}>{'Wait for the detection process ... (' + timeLoading + 's)'}</Text>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  historyImage: {
    width: 40,
    height: 33,
    marginRight: 20,
  },
  mainView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '90%',
  },
  text: {
    fontFamily: FONTS.Lato.Bold,
    fontSize: 30,
    color: 'white',
    width: '80%',
  },
  button: {
    width: '83%',
    height: '11%',
    alignItems: 'center',
    backgroundColor: COLORS.mainPurple,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 30,
    borderRadius: 23,
  },
  buttonImage: {
    width: 62,
    height: 62,
  },
  waitingText: {
    color: COLORS.mainPurple, 
    position: 'absolute', 
    bottom: 10,
    fontFamily: FONTS.Lato.Bold,
    fontSize: 20,
  }
});

//make this component available to the app
export default MainScreen;
