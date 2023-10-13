//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';
import { IMG_HISTORY, IMG_UPLOAD } from '../assets/images';
import FONTS from '../constants/font'
import { COLORS } from '../constants/color';

// create a component
const MainScreen = () => {

    const UploadImage = () => {
        Alert.alert('Upload');
    }

    const UploadVideo = () => {
        Alert.alert('Upload');
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{height: 50, width: '100%', marginTop: 20, alignItems: 'flex-end'}}>
                <TouchableOpacity> 
                    <Image source={IMG_HISTORY} style={styles.historyImage}/>
                </TouchableOpacity>
            </View>
            <View style={styles.mainView}>
                <TouchableOpacity style={styles.button} onPress={UploadImage}>
                    <Text style={styles.text}>Upload Photo</Text>
                    <Image style={styles.buttonImage} source={IMG_UPLOAD}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={UploadVideo}>
                    <Text style={styles.text}>Upload Video</Text>
                    <Image style={styles.buttonImage} source={IMG_UPLOAD}/>
                </TouchableOpacity>
            </View>
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
        marginRight: 20
    },
    mainView: {
        justifyContent:'center',
        alignItems:'center',
        width: '100%',
        height: '100%',
    },
    text: {
        fontFamily: 'Lato-Bold_2',
        fontSize: 30,
        color: 'white',
        width: '80%'
    },
    button: {
        width: '83%',
        height: '11%',
        alignItems: 'center',
        backgroundColor: COLORS.mainPurple,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical:5,
        marginBottom: 30,
        borderRadius: 23,
    },
    buttonImage: {
        width: 62,
        height: 62,
    }
});

//make this component available to the app
export default MainScreen;
