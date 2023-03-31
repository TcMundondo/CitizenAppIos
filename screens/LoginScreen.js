import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'

import { KeyboardAvoidingView, StyleSheet,  TextInput, TouchableOpacity, View, Image  , Modal ,Pressable ,Linking } from 'react-native'
import { app } from '../firebase'
import { getAuth, createUserWithEmailAndPassword ,  signInWithEmailAndPassword , onAuthStateChanged } from "firebase/auth";
import * as Animatable from 'react-native-animatable';
import {   Text  } from 'react-native';
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import {  linkWithCredential, EmailAuthProvider } from "firebase/auth";

import { Checkbox } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import termsText from './components/termsText'


//import { TextInput } from 'react-native-paper';

const auth = getAuth();



const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [modalVisible, setModalVisible] = useState(true);
  const [checked, setChecked] = React.useState(false);
  


 // error catching variables

  const [isUsernameValid, setUsernameValid] = useState(false)

  const [isEmailnameValid, setEmailValid] = useState(false)
 
 
  

  const navigation = useNavigation()

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
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      setEmailValid(true) ;
        console.log( error.message , error.code);

       

      
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
        fontWeight: "500" ,
        fontSize: 20
        
      }} >Welcome Back</Text>
          <Text style={{ fontWeight: "300" , marginTop: 7}}>Hello Citizen. Let’s get you started</Text>

      </View>
      <View style={styles.inputContainer}>
      
     
 {isUsernameValid? (<Animatable.Text   style={{color:"grey" , paddingBottom:10 ,paddingTop:10}}animation="zoomInUp">invalid email and password , Are you a registered user? </Animatable.Text>)
      
       : null}


 
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />

{isEmailnameValid?    <Animatable.Text  style={{color:'#F7A10D' , paddingBottom:10 ,paddingTop:10}} animation="zoomInUp">password must be atleast 8 Characters</Animatable.Text>  
        :null }

  
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
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
       
      
      </View>
      
      <Text style={{
        fontWeight: "100" ,
        marginTop:50
        
      }} >powered by</Text>
      <Image
          style={styles.tinyLogo2}
          source={require('../assets/adaptive-iconZim.png')}
        />
         

      </KeyboardAvoidingView>
     

  )
}

export default LoginScreen

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
    width: '90%'
  },
  input: {
    backgroundColor: 'white',
    marginVertical: 40,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
   
    marginTop: 3,
  
  },
  buttonContainer: {
    marginTop: 10,
    width: '90%',
   

  },
  button: {
    backgroundColor: '#F7A10D',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonOutline: {
    
    marginTop: 5,
   
    borderWidth: 2,
  },
  buttonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: 'white',
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  Checkboxcontainer:{
    flexDirection: 'row',
    marginVertical: 10 ,
    alignItems:"center",
  
   

   

    

  },
  thecheckbox:{
    width: 30 ,
    height: 30 ,
    marginRight:20


  }
  
})