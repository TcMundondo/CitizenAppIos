
import { useNavigation , useRoute } from '@react-navigation/core'
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
  Linking,
  Button
} from 'react-native';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
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

export default function PhoneVerification() {
  const navigation = useNavigation();
  
  const auth = getAuth();

  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const [checked, setChecked] = React.useState(false);
  const [checkedAnonymous, setCheckedAnonymous] = React.useState(true);
  const [checkedStandard, setCheckedStandard] = React.useState(false);
  const firebaseConfig = app ? app.options : undefined;
  const [message, showMessage] = React.useState();
  const attemptInvisibleVerification = false;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({value, setValue,});
  const [UserName, setUserName] = useState('');

 const createAccount = async () => {
  try {

    const phoneProvider = new PhoneAuthProvider(auth);
    const verificationId = await phoneProvider.verifyPhoneNumber(
      phoneNumber,
      recaptchaVerifier.current
    );
    setVerificationId(verificationId);
    console.log(verificationId) ;
    navigation.navigate("VerificationCode" , {verificationId: verificationId}) ;
  
  } catch (err) {
    showMessage({ text: `Error: Please Enter Valid Phone Number In Format +263`, color: 'grey' });
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
        
      }} >Create Account</Text>

      <Text style={{ fontWeight: "300" , marginTop: 7}}>Hello Citizen. Let’s get you started</Text>

      </View>
      <View style={styles.checkAccount}>
        <View style={{flexDirection:"row" , alignItems:"center", marginHorizontal: 8}}>
              <Checkbox.Android  status={checkedAnonymous ? 'checked' : 'unchecked'} onPress={() => {setCheckedAnonymous(!checkedAnonymous);setCheckedStandard(false)}}/>
                    <Text style={{fontWeight: "300" ,color: "#F7A10D" ,marginVertical: 5,fontSize: 10}}>
                    Anonymous user
                    </Text>
            </View>
            <View style={{flexDirection:"row" , alignItems:"center" , marginHorizontal: 8}}>
            <Checkbox.Android status={checkedStandard ? 'checked' : 'unchecked'} onPress={() => {setCheckedStandard(!checkedStandard);setCheckedAnonymous(false) }}/>
                    <Text style={{fontWeight: "300" ,color: "#F7A10D" ,marginVertical: 5,fontSize: 10}}>
                    Standard user
                    </Text>
              </View>
         
      </View>
      <View style={styles.inputContainer}>
      {checkedStandard ?
      <View>
              <Text style={{ marginTop: 20 }}>Username:</Text>
              <TextInput
               style={styles.input}

                placeholder="@Citizen"
                value={UserName}
                onChangeText={text => setUserName(text)}
              />
          </View>
          : null
        
      }  
      <Text style={{ marginTop: 20 }}>Phone number:</Text>
      <TextInput
       style={styles.input}
        placeholder="+263 770 100 200"
        
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        onChangeText={setPhoneNumber}
      />
        <View style={styles.Checkboxcontainer}>
              <Checkbox.Android status={checked ? 'checked' : 'unchecked'} onPress={() => {setChecked(!checked)}}/>
                <Pressable onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={{fontWeight: "300" ,color: "#F7A10D" ,marginVertical: 5,fontSize: 10}}  onPress={() => {Linking.openURL('https://zimcitizen.app/#privacy');}}>
                        I have read and agreed to the Privacy policy, T & Cs and User policy.</Text>
               </Pressable>
         
           </View>
     
    
        <TouchableOpacity
        onPress={createAccount}
        disabled={!checked}
      
        style={{
        color: '#F7A10D' ,
        marginTop: 20 ,
        borderRadius: 4 , 
        height: 45 , 
        alignItems: 'center',
        justifyContent:"center",
        backgroundColor: checked ? '#F7A10D' : 'rgba(247, 161, 13, 0.5)' }}
        >
          <Text style={styles.buttonText}>Create Account</Text>
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
      width: '90%'
    },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 4,
      height:50,
     
      marginTop: 3,
      marginBottom:4,
      borderWidth: 1,
      borderColor: '#E6E6E7'
    
    },
    buttonContainer: {
      width: '90%',
     
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
  checkAccount:{
    flexDirection: 'row',
    alignItems:"center"
  },
    thecheckbox:{
      width: 30 ,
      height: 30 ,
     
  
  
    }
  })