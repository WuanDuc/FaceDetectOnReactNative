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
import {IMG_APPICON, IMG_UPLOAD} from '../assets/images';
import FONTS from '../constants/font';
import {COLORS} from '../constants/color';
import * as FS from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import {Buffer} from 'buffer';
import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import {AdvancedImage} from 'cloudinary-react-native';
import {Cloudinary} from '@cloudinary/url-gen';
import * as FileSystem from 'expo-file-system';
import scale from '../constants/responsive';

// create a component
const MainScreen = ({props, route, navigation}) => {
  const [cameraRollPer, setCameraRollPer] = useState(null);
  const [disableButton, setDisableButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLoading, setTimeLoading] = useState(0);
  const [uri, setUri] = useState();
  const countRef = useRef(null);
  const UploadImage = async () => {
    console.log('acb');
    await ImagePicker.requestCameraPermissionsAsync();
    const permission = await ImagePicker.getCameraPermissionsAsync();
    permission.canAskAgain = true;
    console.log(permission);
    if (permission == null || !permission.granted) {
      Alert.alert("We don't have Media Library Permission!");
      return;
    }
    setIsLoading(true);
    countRef.current = setInterval(() => {
      setTimeLoading(timeLoading => timeLoading + 1);
    }, 1000);
    setTimeLoading(0);
    await pickMedia()
      .then(setCameraRollPer(cameraRollPer))
      .then(setDisableButton(false));
  };
  const cloudinary = new Cloudinary({
    cloud: {
      cloudName: 'dpej7xgsi',
    },
    url: {
      secure: true,
    },
  });
  const options = {
    upload_preset: 'test_preset',
    tag: 'test',
    unsigned: true,
  };
  const UploadVideo = () => {
    Alert.alert('This feature will be updated soon!');
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
      Alert.alert(
        'Lỗi video',
        'Rất tiếc không thể sử dụng video này, vui lòng đổi sang file khác',
      );
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
      console.log('uri', result.assets[0].uri);
      // await toServer({
      //   type: result.assets[0].type,
      //   base64: result.assets[0].base64,
      //   uri: result.assets[0].uri,
      //});

      setUri(result.assets[0].uri);
      const uri = result.assets[0].uri;
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const extension = fileInfo.uri.split('.').pop();
      console.log(extension);
      const type = result.assets[0].type + '/' + extension;
      const name = uri.split('/').pop();
      const source = {
        uri,
        type,
        name,
      };
      //console.log(result.assets[0]);
      await cloudinaryUploadImage(source);
    } else {
      // console.log(result.assets[0].type + " false");
      // let base64 = await uriToBase64(result.assets[0].uri);
      // await toServer({
      //   type: result.assets[0].type,
      //   base64: base64,
      //   uri: result.assets[0].uri,
      // });
      console.log(result);
      const uri = result.assets[0].uri;
      const type = result.assets[0].type + '/mp4';
      const name = uri.split('/').pop();
      const source = {
        uri,
        type,
        name,
      };
      console.log(source.name);
      await cloudinaryUpload(source);
    }
  };

  const cloudinaryUpdate = async photo => {
    const data = new FormData();
    data.append('file', photo);
    data.append('upload_preset', 'videoApp');
    data.append('cloud_name', 'dpej7xgsi');
    fetch(
      'https://api.cloudinary.com/v1_1/dpej7xgsi/video/upload/v1702289247/xlyelkfr75ccs4mp4mcw.mp4',
      {
        method: 'PUT',
        body: data,
        headers: {
          Accept: 'application/json',
        },
      },
    )
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setIsLoading(true);
      })
      .catch(error => {
        console.log(error);
        Alert.alert(
          'Lỗi tải file',
          'Quá trình tải file lên server gặp lỗi, vui lòng thử lại\nStatus code: ' +
            error,
        );
        setIsLoading(false);
        clearInterval(countRef.current);
        setTimeLoading(0);
      });
  };

  const cloudinaryUploadImage = async photo => {
    const data = new FormData();
    data.append('file', photo);
    data.append('upload_preset', 'videoApp');
    data.append('cloud_name', 'dpej7xgsi');
    fetch('https://api.cloudinary.com/v1_1/dpej7xgsi/image/upload', {
      method: 'POST',
      body: data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => res.json())
      .then(async data => {
        console.log(data);
        console.log('ok, go to server');
        console.log(data.url);
        await toServer({
          type: 'image',
          base64: data.url,
          uri: data.url,
        });
      })
      .catch(error => {
        console.log(error);
        Alert.alert(
          'Lỗi tải file',
          'Quá trình tải file lên server gặp lỗi, vui lòng thử lại\nStatus code: ' +
            error,
        );
        setIsLoading(false);
        clearInterval(countRef.current);
        setTimeLoading(0);
      });
  };
  const cloudinaryUpload = async photo => {
    const data = new FormData();
    data.append('file', photo);
    data.append('upload_preset', 'videoApp');
    data.append('cloud_name', 'dpej7xgsi');
    fetch('https://api.cloudinary.com/v1_1/dpej7xgsi/video/upload', {
      method: 'POST',
      body: data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(res => res.json())
      .then(async data => {
        console.log(data);
        console.log('ok, go to server');
        console.log(data.url);
        await toServer({
          type: 'video',
          base64: data.url,
          uri: data.url,
        });
      })
      .catch(error => {
        console.log(error);
        Alert.alert(
          'Lỗi tải file',
          'Quá trình tải file lên server gặp lỗi, vui lòng thử lại\nStatus code: ' +
            error,
        );
        setIsLoading(false);
        clearInterval(countRef.current);
        setTimeLoading(0);
      });
  };
  const toServer = async mediaFile => {
    let type = mediaFile.type;
    let schema = 'http://';
    //let host = '10.0.2.2:5000';
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
        console.log('Getting response...');
        if (route === '/image') {
          const value = JSON.parse(response.data);
          const videoUrl = value['url'];
          console.log(videoUrl);
          fetch(videoUrl)
            .then(res => res.arrayBuffer())
            .then(buffer => {
              const base64 = Buffer.from(buffer).toString('base64');
              // do something with the base64 data
              navigation.navigate('ShowScreen', {
                dataType: uri,
                data: base64,
                content_type: content_type,
              });
            })
            .then(buffer => {
              setIsLoading(false);
              clearInterval(countRef.current);
              setTimeLoading(0);
            });
        } else {
          const value = JSON.parse(response.data);
          const videoUrl = value['url'];
          console.log(videoUrl);
          fetch(videoUrl)
            .then(res => res.arrayBuffer())
            .then(buffer => {
              const base64 = Buffer.from(buffer).toString('base64');
              // do something with the base64 data
              navigation.navigate('ShowScreen', {
                dataType: 'video',
                data: base64,
                content_type: content_type,
              });
            })
            .then(buffer => {
              setIsLoading(false);
              clearInterval(countRef.current);
              setTimeLoading(0);
            });
        }
      })
      .catch(error => {
        console.log(error);
        Alert.alert(
          'Lỗi tải file',
          'Quá trình tải file lên server gặp lỗi, vui lòng thử lại\nStatus code: ' +
            error,
        );
        setIsLoading(false);
        clearInterval(countRef.current);
        setTimeLoading(0);
      });
  };

  useEffect(() => {
    setCameraRollPer(true), setDisableButton(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          height: scale(50),
          width: '100%',
          marginTop: scale(20),
          alignItems: 'flex-end',
        }}></View>
      <View style={styles.mainView}>
        <Image source={IMG_APPICON} style={{marginBottom: 30}}></Image>
        <TouchableOpacity
          style={
            !isLoading
              ? styles.button
              : [styles.button, {backgroundColor: 'gray'}]
          }
          onPress={UploadImage}
          disabled={isLoading}>
          <Text style={styles.text}>Upload File</Text>
          <Image style={styles.buttonImage} source={IMG_UPLOAD} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.waitingText, {opacity: isLoading ? 1 : 0}]}>
        {'Wait for the detection process ... (' + timeLoading + 's)'}
      </Text>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.mainPurple,
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
    color: COLORS.lightPurple,
    width: '80%',
    color: COLORS.mainPurple,
  },
  button: {
    width: '83%',
    height: '11%',
    alignItems: 'center',
    backgroundColor: COLORS.lightPurple,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: scale(30),
    borderRadius: 23,
  },
  buttonImage: {
    width: 62,
    height: 62,
  },
  waitingText: {
    color: COLORS.lightPurple,
    position: 'absolute',
    bottom: 10,
    fontFamily: FONTS.Lato.Bold,
    fontSize: 20,
  },
});

//make this component available to the app
export default MainScreen;
