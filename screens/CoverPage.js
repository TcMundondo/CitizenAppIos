import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'

import { KeyboardAvoidingView, StyleSheet,  TextInput, TouchableOpacity, View, Image  } from 'react-native'

import { getAuth, createUserWithEmailAndPassword ,  signInWithEmailAndPassword , onAuthStateChanged } from "firebase/auth";

import {   Text  } from 'react-native';








const CoverPage = () => {

 // error catching variables

 const auth = getAuth();
 const navigation = useNavigation();
 
 
 
  

 
  const handleEmailLogin = () => {
    navigation.navigate("LoginScreen");

  
}
 const handlePhoneLogin = () => {
        navigation.navigate("PhoneVerification");}
return (
   <View style={styles.container}>
        <View style={{marginBottom: 10, justifyContent: 'center',alignItems: 'center'}}>
          <Image style={styles.tinyLogo} source={require('../assets/adaptive-icon.png')}/>
      <Text style={{ fontWeight: "bold"}} >CitizenApp</Text>
      <Text style={{ fontWeight: "300" , marginTop: 7}} >Hello Citizen. Let’s get you started</Text>
     </View>


      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={ handleEmailLogin  } style={[styles.button, styles.buttonOutline]}>
          <Text  style={styles.buttonOutlineText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={ handlePhoneLogin }
      
        style={styles.button}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      
      </View>
      
      <Text style={{fontWeight: "100" ,marginTop: 40}}> Powered by  </Text>
      <Image
          style={styles.tinyLogo2}
          source={require('../assets/adaptive-iconZim.png')}
        />

      </View>
     

  )
}

export default CoverPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white"
  },
  tinyLogo: {
 
  
    width: 100,
    height: 100,
   
  
    paddingBottom:10,
    
   
   
  
   
    
  },
  tinyLogo2: {
 
  
    width: "80%",
    height: "20%",
   
  
    paddingBottom:10,
    
   
   
  
   
    
  },

  inputContainer: {
    width: '80%'
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
   
    marginTop: 3,
  
  },
  buttonContainer: {
    width: '90%',
   
    marginTop: 25
  },
  button: {
    backgroundColor: '#F7A10D',
    width: '100%',
    height: 45 ,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10 
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#F7A10D',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#F7A10D',
    fontWeight: '400',
    fontSize: 16,
  },
  error: {
    Color: 'red',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    fontWeight: 'bold',
  },
})