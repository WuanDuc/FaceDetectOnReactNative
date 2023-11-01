/* eslint-disable prettier/prettier */
//import liraries
import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {IMG_HISTORY, IMG_Loading, IMG_SHARE, IMG_UPLOAD} from '../assets/images';
import FONTS from '../constants/font';
import {COLORS} from '../constants/color';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import { Video, ResizeMode } from 'expo-av';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

// create a component
const ShowImageScreen = ({props, route, navigation}) => {
  const [image, setImage] = useState(null);
  const [htmlcode, setHtmlcode] = useState(null);

  const {dataType, data, content_type} = route.params;

  const ShareData = async() => {
    const shareOptions = {
      message: 'Write something to your friend',
      url: `data:${content_type};base64, ${data}`
    };

    try {
      const ShareResponse = await Share.open(shareOptions)
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log(error);
    }
  };

  function b64toblob(b64data, contenttype, slicesize) {
    contenttype = contenttype || '';
    slicesize = slicesize || 512;
  
    var bytecharacters = atob(b64data);
    var bytearrays = [];
  
    for (var offset = 0; offset < bytecharacters.length; offset += slicesize) {
      var slice = bytecharacters.slice(offset, offset + slicesize);
  
      var bytenumbers = new array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        bytenumbers[i] = slice.charcodeat(i);
      }
  
      var bytearray = new uint8array(bytenumbers);
  
      bytearrays.push(bytearray);
    }
  
    var blob = new blob(bytearrays, {type: contenttype});
    return blob;
  }

  const downloadToFile = (base64Content) => {
    const path = `file://${RNFS.DocumentDirectoryPath}/video.mp4`
    
    RNFS.writeFile(path, base64Content, 'base64')
    .then(success => {
      console.log('FILE WRITTEN: ', 'abc')
    })
    .catch(err => {
      console.log('File Write Error: ', err.message);
      Alert.alert("Quá trình phát video gặp một số lỗi: " + err.message);
      navigation.goBack();
    })
  }
  useEffect(()=>{
    downloadToFile(data);
  },[])
  
  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <Text style={styles.text}>Result</Text>
        <TouchableOpacity onPress={ShareData}>
          <Image style={styles.image} source={IMG_SHARE}></Image>
        </TouchableOpacity>
      </View>
      {content_type == 'video/mp4' ? (
        // <WebView style={{ flex: 1, width: 200, height: 200, resizeMode: 'contain' }} 
        // source={{ html: htmlcode, baseurl: rnfetchblob.fs.dirs.dcimdir }}/>
        <Video
          style={styles.resultImage}
          source={{
            uri: `file://${RNFS.DocumentDirectoryPath}/video.mp4`
            // uri: `data:video/mp4; base64, ${base64code}`,
            // uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          // onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      ) : (
        <Image
        style={styles.resultImage}
        source={{
          uri: `data:${content_type};base64, ${data}`,}}></Image>
      )}
      {/* <Image
        style={{ width: 200, height: 200 }}
        source={{
          uri: `data:${content_type};base64,${response.data}`,
        }}
      /> */}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  mainView: {
    marginTop: 50,
    height: 70,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontFamily: FONTS.Lato.Bold,
    fontSize: 30,
    color: COLORS.mainPurple,
  },
  image: {
    height: 50,
    width: 35,
    overflow: 'visible',
  },
  resultImage: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: COLORS.mainPurple,
    height: '80%',
    width: '100%',
    resizeMode: 'contain',
    borderWidth: 3,
    borderColor: "purple",
    borderRadius: 10,
  },
});

//make this component available to the app
export default ShowImageScreen;
