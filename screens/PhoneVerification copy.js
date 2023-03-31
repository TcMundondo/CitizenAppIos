
import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  TextInput,
 StyleSheet,
  TouchableOpacity,
  Platform,
  Image ,
  Modal,
  Pressable,
  ScrollView,
  Linking
} from 'react-native';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { Button } from 'react-native-paper';
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
const auth = getAuth(app);
const CELL_COUNT = 6;
if (!app?.options || Platform.OS === 'web') {
  throw new Error(
    'This example only works on Android or iOS, and requires a valid Firebase config.'
  );
}

export default function PhoneVerification({ navigation }) {
  
  const auth = getAuth();
  //const navigation = useNavigation();
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const [checked, setChecked] = React.useState(false);
  const firebaseConfig = app ? app.options : undefined;
  const [message, showMessage] = React.useState();
  const attemptInvisibleVerification = false;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({value, setValue,});

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
        
      }} >CitizenApp</Text>
      </View>
      <View style={styles.inputContainer}>
      <Text style={{ marginTop: 20 }}>Enter phone number </Text>
      <TextInput
       style={styles.input}
        placeholder="use format +263"
        autoFocus
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        onChangeText={setPhoneNumber}
      />
      <Button
       
        color={'#F7A10D'}
        style={{color: '#F7A10D' , marginTop: 20 , borderRadius: 8 }}
        mode= "contained"
       
        disabled={!phoneNumber || !checked}
        onPress={async () => {
          try {
            const phoneProvider = new PhoneAuthProvider(auth);
            const verificationId = await phoneProvider.verifyPhoneNumber(
              phoneNumber,
              recaptchaVerifier.current
            );
            setVerificationId(verificationId);
            console.log(verificationId) ;
            navigation.navigate("PhoneVerification",{verificationId: verificationId });
          
          } catch (err) {
            showMessage({ text: `Error: ${err.message}`, color: 'red' });
          }
        }}> Send code </Button>
        <Text style={{ marginTop: 20 }}>Enter Verification code</Text>
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
     
      <Button
        color={'#F7A10D'}
        style={{color: '#F7A10D' , marginTop: 20 , borderRadius: 8 }}
        mode= "contained"
        disabled={!verificationId || !checked }
        onPress={async () => {
          try {
            const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
            await signInWithCredential(auth, credential);
            showMessage({ text: 'Phone authentication successful 👍' });
          } catch (err) {
            showMessage({ text: `Error: ${err.message}`, color: 'red' });
          }
        }}
      > Verify</Button>
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
      <View style={styles.Checkboxcontainer}>
               <Checkbox.Android
        
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => {
                  setChecked(!checked);
                }}
        />
               <Pressable
            
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Text style={{
                    fontWeight: "bold" ,
                    color: "#F7A10D" ,
                    marginVertical: 5,
                    fontSize: 10
                  }} 
                  onPress={() => {Linking.openURL('https://zimcitizen.app/#privacy');}}>
         I have read and agree to Privacy Policy , TERMS AND {`\n`} CONDITIONS and User Policy</Text>
       </Pressable>
         
           </View>

       
        

      <Text style={{
        fontWeight: "bold" ,
        marginTop:50
        
      }} >powered by ZIMCODD </Text>
      <Image
          style={styles.tinyLogo2}
          source={require('../assets/adaptive-iconZim.png')}
        />
      {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
      <View style={styles.centeredView}>
     
    </View>
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
      borderWidth: 2,
      borderColor: '#00000030',
      textAlign: 'center',
    },
    focusCell: {
      borderColor: '#000',
    },
   inputContainer: {
      width: '80%'
    },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 5,
      height:50,
     
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
      backgroundColor: '#F7A10D',
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
      alignItems:"center"
  
     
  
      
  
    },
    thecheckbox:{
      width: 30 ,
      height: 30 ,
      marginRight:20
  
  
    }
  })