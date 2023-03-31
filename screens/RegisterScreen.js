import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'

import { KeyboardAvoidingView, StyleSheet,  TextInput, TouchableOpacity, View, Image  } from 'react-native'
import { app } from '../firebase'
import { getAuth, createUserWithEmailAndPassword ,  signInWithEmailAndPassword , onAuthStateChanged ,isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { sendSignInLinkToEmail } from "firebase/auth";
import * as Animatable from 'react-native-animatable';
import {   Text  } from 'react-native'

//import { TextInput } from 'react-native-paper';

const auth = getAuth();



const RegisterScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

 // error catching variables

  const [isUsernameValid, setUsernameValid] = useState(false)

  const [isEmailnameValid, setEmailValid] = useState(false)
 
 
  

  const navigation = useNavigation()
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'https://citizen-cfd29.firebaseapp.com',
    // This must be true.
    handleCodeInApp: true,
   
  };

  useEffect(() => {
    const unsubscribe =   onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          navigation.replace("Home")
          const uid = user.uid;
          // ...
        } else {
          // User is signed out
          // ...
        }
      });

    return unsubscribe
  }, [])

  const handleSignUp = () => {
     const auth = getAuth();
     sendSignInLinkToEmail(auth, email, actionCodeSettings)
  .then(() => {
    // The link was successfully sent. Inform the user.
    // Save the email locally so you don't need to ask the user for it again
    // if they open the link on the same device.
    window.localStorage.setItem('emailForSignIn', email);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });
  }

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user.id) ;
      // ...
    })
    .catch((error) => {
      

      
      // do a state change for it to work
      console.log( error.message , error.code);

      // help to display state to view
      
      setUsernameValid(true) ;
      // ..
     //const Error =
    });
   
}

  return (
   
   
       <KeyboardAvoidingView
             style={styles.container}
          >
          <View style={{
       marginBottom: 30,
       justifyContent: 'center',
       alignItems: 'center',
      }}>
          <Image
          style={styles.tinyLogo}
          source={require('../assets/adaptive-icon.png')}
        />
      <Text style={{
        fontWeight: "bold" ,
        
      }} >CitizenApp</Text>
      </View>
      <View style={styles.inputContainer}>
      
     
 {isUsernameValid? (<Animatable.Text   style={{color:"grey" , paddingBottom:10 ,paddingTop:10}}animation="zoomInUp">invalid email and password , Are you a registered user? </Animatable.Text>)
      
       :  <Animatable.Text  style={{color:"grey" , paddingBottom:10 ,paddingTop:10}} animation="zoomInUp">require a valid email </Animatable.Text>}

     
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />

    <Animatable.Text  style={{color:"grey" , paddingBottom:10 ,paddingTop:10}} animation="zoomInUp">password must be atleast 8 Characters</Animatable.Text>  
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={{
        fontWeight: "bold" ,
        marginTop:50
        
      }} >powered by ZIMCODD </Text>
      <Image
          style={styles.tinyLogo2}
          source={require('../assets/adaptive-iconZim.png')}
        />

      </KeyboardAvoidingView>
     

  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: '80%',
   
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
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