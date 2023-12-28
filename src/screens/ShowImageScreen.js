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
import {
  IMG_APPICON,
  IMG_APPICONNOTEXT,
  IMG_HISTORY,
  IMG_Loading,
  IMG_SAVE,
  IMG_SHARE,
  IMG_UPLOAD,
} from '../assets/images';
import FONTS from '../constants/font';
import {COLORS} from '../constants/color';
import {Video, ResizeMode} from 'expo-av';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import * as MediaLibrary from 'expo-media-library';
import scale from '../constants/responsive';

// create a component
const ShowImageScreen = ({props, route, navigation}) => {
  // const [status, requestPermission] = useState(
  //   ImagePicker.requestMediaLibraryPermissionsAsync(),
  // );

  const {dataType, data, content_type} = route.params;

  const ShareData = async () => {
    const shareOptions = {
      message: 'Write something to your friend',
      url: `data:${content_type};base64, ${data}`,
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log(error);
    }
  };

  const SaveData = async () => {
    // if (status._j != null && status._j._j != null && status._j._j.granted) {
    if (content_type === 'video/mp4') {
      await MediaLibrary.saveToLibraryAsync(
        `file://${RNFS.DocumentDirectoryPath}/video.mp4`,
      ).finally(() => {
        Alert.alert('Thông báo', 'Lưu video thành công');
      });
    } else {
      await MediaLibrary.saveToLibraryAsync(
        `file://${RNFS.DocumentDirectoryPath}/image.jpg`,
      ).finally(() => {
        Alert.alert('Thông báo', 'Lưu ảnh thành công');
      });
    }
    // } else {
    //   console.log('No permission', status);
    //   async () => {
    //     requestPermission(
    //       await ImagePicker.requestMediaLibraryPermissionsAsync(),
    //     );
    //   };
    // }
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

  const downloadToFile = base64Content => {
    const path = `file://${RNFS.DocumentDirectoryPath}/video.mp4`;

    RNFS.writeFile(path, base64Content, 'base64')
      .then(success => {
        console.log('FILE WRITTEN: ', 'abc');
      })
      .catch(err => {
        console.log('File Write Error: ', err.message);
        Alert.alert('Quá trình phát video gặp một số lỗi: ' + err.message);
        navigation.goBack();
      });
  };

  const downloadToFileImage = base64Content => {
    const path = `file://${RNFS.DocumentDirectoryPath}/image.jpg`;

    RNFS.writeFile(path, base64Content, 'base64')
      .then(success => {
        console.log('FILE WRITTEN: ', 'abc');
      })
      .catch(err => {
        console.log('File Write Error: ', err.message);
        Alert.alert('Quá trình tải ảnh gặp một số lỗi: ' + err.message);
        navigation.goBack();
      });
  };

  const goBackToHome = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (content_type == 'video/mp4') {
      downloadToFile(data);
    } else {
      downloadToFileImage(data);
    }

    // console.log(status);

    // if (status._j == null) {
    //   requestPermission(ImagePicker.requestMediaLibraryPermissionsAsync());
    // }

    // if (status._j != null && status._j._j != null && !status._j._j.granted) {
    //   (async () => {
    //     await ImagePicker.requestMediaLibraryPermissionsAsync();
    //   })();
    // }
  }, []);

  // if (status._j == null || status._j != null && status._j._j != null && !status._j._j.granted) {
  //   return <Text>We need your library permi</Text>
  // }

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <Text style={styles.text}>Result</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={SaveData}>
            <Image style={styles.image} source={IMG_SAVE}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={ShareData}>
            <Image style={styles.image} source={IMG_SHARE}></Image>
          </TouchableOpacity>
        </View>
      </View>
      {content_type == 'video/mp4' ? (
        // <WebView style={{ flex: 1, width: 200, height: 200, resizeMode: 'contain' }}
        // source={{ html: htmlcode, baseurl: rnfetchblob.fs.dirs.dcimdir }}/>
        <Video
          style={styles.resultImage}
          source={{
            uri: `file://${RNFS.DocumentDirectoryPath}/video.mp4`,
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
            uri: `data:${content_type};base64, ${data}`,
          }}></Image>
      )}
      {/* <Image
        style={{ width: 200, height: 200 }}
        source={{
          uri: `data:${content_type};base64,${response.data}`,
        }}
      /> */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '90%',
          height: scale(80),
        }}>
        <TouchableOpacity style={styles.button} onPress={goBackToHome}>
          <Text style={[styles.text, {color: COLORS.mainPurple}]}>
            Back to Home
          </Text>
        </TouchableOpacity>
        <Image
          style={{width: 60, height: 80}}
          source={IMG_APPICONNOTEXT}></Image>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.mainPurple,
  },
  mainView: {
    marginTop: scale(50),
    height: scale(70),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontFamily: FONTS.Lato.Bold,
    fontSize: 30,
    color: COLORS.lightPurple,
  },
  image: {
    height: 50,
    width: 35,
    overflow: 'visible',
    marginLeft: 20,
  },
  resultImage: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: COLORS.lightPurple,
    height: '65%',
    width: '100%',
    resizeMode: 'contain',
    // borderWidth: 3,
    // borderColor: "purple",
    // borderRadius: 10,
  },
  button: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.lightPurple,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 23,
  },
});

//make this component available to the app
export default ShowImageScreen;
