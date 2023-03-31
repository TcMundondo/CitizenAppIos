import { useNavigation , useRoute } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView, Image ,
  Modal,
  Pressable,
  ScrollView,
  Linking
} from 'react-native';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
//import { initializeApp, getApp } from 'firebase/app';
import { getAuth, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { Checkbox } from 'react-native-paper';
import termsText from './components/termsText';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { app } from '../firebase'
/********************************************************************************************************************************************************** */



const auth = getAuth(app);
const CELL_COUNT = 6;


// Double-check that we can run the example
if (!app?.options || Platform.OS === 'web') {
  throw new Error(
    'This example only works on Android or iOS, and requires a valid Firebase config.'
  );
}

export default function VerificationCode() {
  const navigation = useNavigation();
  const route = useRoute();
  const {verificationId} = route.params ;

  // Ref or state management hooks
  const recaptchaVerifier = React.useRef(null);
  const [verificationCode, setVerificationCode] = React.useState();
  const [checked, setChecked] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(true);

  const firebaseConfig = app ? app.options : undefined;
  const [message, showMessage] = React.useState();
  const attemptInvisibleVerification = false;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const verify = async()  => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId  , verificationCode);
      await signInWithCredential(auth, credential);
      showMessage({ text: 'Phone authentication successful 👍' });
    } catch (err) {
      showMessage({ text: `Error: ${err.message}`, color: 'red' });
    }
    

  }

  return (
     
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        // attemptInvisibleVerification
        />
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
        fontSize: 20
        
      }} >Verification</Text>

    <Text style={{ fontWeight: "300" , marginTop: 7}}>Enter the verification code sent to your phone number.</Text>
      </View>
     <View style={styles.inputContainer}>
       
      <CodeField
        ref={ref}
        {...props}
        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
        value={verificationCode}
        onChangeText={setVerificationCode}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
     
      
      <TouchableOpacity
        onPress={verify}
        disabled={!verificationId}
      
        style={{
        color: '#F7A10D' ,
        marginTop: 20 ,
        borderRadius: 4 , 
        height: 45 , 
        alignItems: 'center',
        justifyContent:"center",
        backgroundColor: checked ? '#F7A10D' : 'rgba(247, 161, 13, 0.5)' }}
        >
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
   
      </View>
      {message ? (
        <TouchableOpacity
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 0xffffffee, justifyContent: 'center' },
          ]}
          onPress={() => showMessage(undefined)}>
          <Text
            style={{
              color: message.color || 'green',
              fontSize: 15,
              textAlign: 'center',
              margin: 20,
            }}>
            {message.text}
          </Text>
        </TouchableOpacity>
      ) : undefined}
     

       
        

      <Text style={{fontWeight: "100", marginTop:50}}> powered by  </Text>
      <Image style={styles.tinyLogo2} source={require('../assets/adaptive-iconZim.png')}/>
      {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
      
    </View>
  );
}


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
    root: {flex: 1, padding: 20},
    title: {textAlign: 'center', fontSize: 30},
    codeFieldRoot: {marginTop: 20},
    cell: {
      width: 40,
      height: 40,
      lineHeight: 38,
      fontSize: 24,
      borderWidth: 0.5,
      borderRadius: 2,
      
      borderColor: '#50545B',
      textAlign: 'center',
    },
    focusCell: {
      borderColor: '#F7A10D',
    },
   inputContainer: {
      width: '80%'
    },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 5,
      height:40,
     
      marginTop: 3,
      marginBottom:4
    
    },
    buttonContainer: {
      width: '80%',
     
      marginTop: 40,
    },
    button: {
      backgroundColor: '#F7A10D',
      width: '100%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop:2
    },
    buttonOutline: {
      backgroundColor: 'white',
      marginTop: 5,
      borderColor: '#F7A10D',
      borderWidth: 2,
    },
    buttonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 16,
    },
    buttonOutlineText: {
      color: '#F7A10D',
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
      backgroundColor: "#F7A10D",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    
  })