/* eslint-disable prettier/prettier */
//import liraries
import React, {Component, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {IMG_HISTORY, IMG_Loading, IMG_UPLOAD} from '../assets/images';
import FONTS from '../constants/font';
import {COLORS} from '../constants/color';
import axios from 'axios';

// create a component
const ShowImageScreen = ({props, route, navigation}) => {
  const [image, setImage] = useState(null);

  const {dataType, data, content_type} = route.params;

  const ShowHistory = () => {
    // Alert.alert(image);
    // console.log(data);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <Text style={styles.text}>Result</Text>
        <TouchableOpacity onPress={ShowHistory}>
          <Image style={styles.image} source={IMG_HISTORY}></Image>
        </TouchableOpacity>
      </View>
      <Image
        style={styles.resultImage}
        source={{
          uri: `data:${content_type};base64, ${data}`,}}></Image>
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
    width: 40,
    height: 33,
  },
  resultImage: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: COLORS.mainPurple,
    height: '80%',
    width: '100%',
    resizeMode: 'contain',
  },
});

//make this component available to the app
export default ShowImageScreen;
