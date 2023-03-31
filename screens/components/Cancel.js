import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TouchableHighlight, Linking, TouchableOpacity, Dimensions } from 'react-native';
import { getAuth } from 'firebase/auth';

const { height, width } = Dimensions.get('window');

const Cancel = () => {

  const navigation = useNavigation();

  // Handle the cancel button press
  const handleCancelPress = () => {
  navigation.replace('Home') ;
 };

  return (
    <TouchableOpacity onPress={handleCancelPress}>
          <Text style={styles.cancelText}>Cancel</Text>
     </TouchableOpacity>
     
  );
};

export default Cancel;






const styles = StyleSheet.create({
    cancelText: {
        fontFamily: 'Helvetica Neue',
        fontSize: 18,
        fontWeight: '400',
        lineHeight: 21,
        letterSpacing: 0,
        textAlign: 'left',
        marginRight: 80
      },
  
    })
