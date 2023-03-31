
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
 
} from 'react-native';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Portal ,Provider} from 'react-native-paper';
import { getAuth,  } from 'firebase/auth';
import SelectDropdown from 'react-native-select-dropdown';
import { app } from '../firebase'
import { async } from '@firebase/util';
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 
import db from '../firebase';
const auth = getAuth(app);
const CELL_COUNT = 6;
if (!app?.options || Platform.OS === 'web') {
  throw new Error(
    'This example only works on Android or iOS, and requires a valid Firebase config.'
  );
}

export default function MaintenaceInAction() {
  const navigation = useNavigation();
  
  const auth = getAuth();

  const [phoneNumber, setPhoneNumber] = React.useState();
  
  const [genderValue, setGender] = useState('');

  const [MaritalStatusValue, setMaritalStatus] = useState('');

  const [value, setValue] = useState('');

  const [applyForValue, setApplyForValueValue] = useState('');

  const [childrenNumberValue, setChildrenNumber] = useState('');

  const [ChildrenAmount, setChildrenAmount] = React.useState();

  const [MaintenanceFee, setMaintenanceFee] = React.useState();
  const [CurrencyValue, setCurrencyValue] = useState('');
  const [Name, setName] = useState('');
  const [visible, setVisible] = React.useState(false);
  const [employment, setEmployment] = useState('');
  const gender = ["Female", "Male"];
  const MaritalStatus = ["Single", "Married"];
  const applyFor = ["Your children" , "My Child(ren)" ,"Myself & My Child(ren)"];
  const childrenNumber = ["Yes" , "No"];
  const Currency = ["ZWL" , "USD"]


 /******************************************************************************************************************************************** */
 const handleSubmit = async(event) => {

  // Validate input data
  if (!Name && !phoneNumber 
    && !MaritalStatusValue 
    && !genderValue && !applyForValue && !ChildrenAmount
    && !employment && !CurrencyValue && !MaintenanceFee && !childrenNumberValue
    
    ) {
    return alert("please fill all the fields");
  }

 
  try {
    event.preventDefault();
    const docRef = await addDoc(collection(db, "MaintenaceInAction"), {
      Fullname: Name,
      phoneNumber: phoneNumber,
      Gender: genderValue,
      ClaimItFor: applyForValue,
      DoYouHaveChildren: childrenNumberValue,
      MaritalStatus : MaritalStatusValue,
      HowManyChildren: ChildrenAmount,
      employment: employment,
      Currency: CurrencyValue,
      EstimateMaintenanceFee: MaintenanceFee,
       createdAt: serverTimestamp(),



     
    });

    alert('Thank you for getting in touch with us, a lawyer will get in touch with you  via whatsapp/text');
    setVisible(true);
   
    
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
 
}
const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);


  return (
    <ScrollView>
    <View style={styles.container}>
      
      <Text style={{ fontWeight: "300" , marginTop:5, fontSize:10}}>Let’s us help you apply for child maintenance</Text>

      
      
    <View style={styles.inputContainer}>
      
      <View>
              <Text style={{ marginTop: 20, marginBottom:9 , fontSize:10}}>Applicant Fullname:</Text>
              <TextInput
               style={styles.input}

                placeholder="@Citizen"
                value={Name}
                onChangeText={text => setName(text)}
              />
          </View>
         
      <Text style={{ marginTop: 20 , marginBottom:9, fontSize:10}}>Phone number:</Text>
      <TextInput
       style={styles.input}
        placeholder="+263 770 100 200"
        
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        onChangeText={setPhoneNumber}
      />

      <Text style={{ marginTop: 20 , marginBottom:9, fontSize:10 }}>Gender:</Text>  
      <View style={{flexDirection:"row" , justifyContent:"space-between", marginTop: 3 }}>

        
      <SelectDropdown 
            borderWidth={1}
            data={gender}
            onSelect={(selectedItem, index) => {
                                                         console.log(selectedItem, index);
                                                         setGender(selectedItem)
                                                       }}
                                                       defaultButtonText={"Female"}
                                                       buttonTextAfterSelection={(selectedItem, index) => {
                                                         return selectedItem;
                                                       }}
                                                       rowTextForSelection={(item, index) => {
                                                         return item;
                                                       }}
                                                     buttonStyle={styles.dropdown1BtnStyle}
                                                     buttonTextStyle={styles.dropdown1BtnTxtStyle}
                                                       renderDropdownIcon={isOpened => {
                                                         return <EvilIcons name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#F7A10D'} size={30} />;
                                                       }}
                                                       dropdownIconPosition={'left'}
                                                      dropdownStyle={styles.dropdown1DropdownStyle}
                                                     rowStyle={styles.dropdown1RowStyle}
                                                      rowTextStyle={styles.dropdown1RowTxtStyle}/>
                 
                 <SelectDropdown 
                                        borderWidth={1}
                                        data={MaritalStatus}
                                                 onSelect={(selectedItem, index) => {
                                                         console.log(selectedItem, index);
                                                         setMaritalStatus( selectedItem)
                                                       }}
                                                       defaultButtonText={"Single"}
                                                       buttonTextAfterSelection={(selectedItem, index) => {
                                                         return selectedItem;
                                                       }}
                                                       rowTextForSelection={(item, index) => {
                                                         return item;
                                                       }}
                                                     buttonStyle={styles.dropdown1BtnStyle}
                                                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                                                       renderDropdownIcon={isOpened => {
                                                         return <EvilIcons name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#F7A10D'} size={30} />;
                                                       }}
                                                       dropdownIconPosition={'left'}
                                                      dropdownStyle={styles.dropdown1DropdownStyle}
                                                     rowStyle={styles.dropdown1RowStyle}
                                                      rowTextStyle={styles.dropdown1RowTxtStyle}
                             
                                           />                          

      </View>

      <Text style={{ marginTop: 20 , marginBottom:9, fontSize:10}}>Whom do you intend to claim it for?</Text>  
      <View style={{ marginTop: 3 }}>

        
      <SelectDropdown 
            borderWidth={1}
            data={applyFor}
            onSelect={(selectedItem, index) => {
                                                         console.log(selectedItem, index);
                                                         setApplyForValueValue(selectedItem)
                                                       }}
                                                       defaultButtonText={"Your children"}
                                                       buttonTextAfterSelection={(selectedItem, index) => {
                                                         return selectedItem;
                                                       }}
                                                       rowTextForSelection={(item, index) => {
                                                         return item;
                                                       }}
                                                     buttonStyle={styles.selectInput}
                                                     buttonTextStyle={styles.dropdown1BtnTxtStyle}
                                                       renderDropdownIcon={isOpened => {
                                                         return <EvilIcons name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#F7A10D'} size={30} />;
                                                       }}
                                                       dropdownIconPosition={'left'}
                                                      dropdownStyle={styles.dropdown1DropdownStyle}
                                                     rowStyle={styles.dropdown1RowStyle}
                                                      rowTextStyle={styles.dropdown1RowTxtStyle}/>
                 </View>
 <View style={{flexDirection:"row" ,  marginTop: 3 ,justifyContent:"space-between" ,alignItems:"center" }}>
      <View style={{flex: 0.5}}>
          <Text style={{ marginTop: 20 , marginBottom:9, fontSize:10}}>Do you have children:</Text> 
              <SelectDropdown borderWidth={1} data={childrenNumber}
            onSelect={(selectedItem, index) => {
                                                         console.log(selectedItem, index);
                                                         setChildrenNumber(selectedItem)
                                                       }}
                                                       defaultButtonText={"Yes"}
                                                       buttonTextAfterSelection={(selectedItem, index) => {
                                                         return selectedItem;
                                                       }}
                                                       rowTextForSelection={(item, index) => {
                                                         return item;
                                                       }}
                                                     buttonStyle={styles.numberChild}
                                                     buttonTextStyle={styles.dropdown1BtnTxtStyle}
                                                       renderDropdownIcon={isOpened => {
                                                         return <EvilIcons name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#F7A10D'} size={30} />;
                                                       }}
                                                       dropdownIconPosition={'left'}
                                                      dropdownStyle={styles.dropdown1DropdownStyle}
                                                     rowStyle={styles.dropdown1RowStyle}
                                                      rowTextStyle={styles.dropdown1RowTxtStyle}/>
    </View>
    <View style={{flex: 0.5 }}>
        <Text style={{ marginTop: 20 , marginBottom:9 , fontSize:10}}> If yes How many children:</Text> 
        <TextInput
                style={styles.number}
                  placeholder="1"
                  autoCompleteType="tel"
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  onChangeText={setChildrenAmount}
                />   
         </View>                    

  </View>
      <View>
              <Text style={{ marginTop: 20, marginBottom:9 , fontSize:10}}>Are you employed ( if yes state employment ):</Text>
              <TextInput
               style={styles.input}
                value={employment}
                onChangeText={text => setEmployment(text)}
              />
          </View>
          <View style={{flexDirection:"row" ,  marginTop: 3 ,justifyContent:"space-between", alignItems:"center" }}>
      <View style={{flex: 0.5}}>

  <Text style={{ marginTop: 20 , marginBottom:9, fontSize:10 }}>Currency:</Text> 
      <SelectDropdown borderWidth={1} data={Currency}
            onSelect={(selectedItem, index) => {
                                                         console.log(selectedItem, index);
                                                         setCurrencyValue(selectedItem)
                                                       }}
                                                       defaultButtonText={"ZWL"}
                                                       buttonTextAfterSelection={(selectedItem, index) => {
                                                         return selectedItem;
                                                       }}
                                                       rowTextForSelection={(item, index) => {
                                                         return item;
                                                       }}
                                                     buttonStyle={styles.numberChild}
                                                     buttonTextStyle={styles.dropdown1BtnTxtStyle}
                                                       renderDropdownIcon={isOpened => {
                                                         return <EvilIcons name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#F7A10D'} size={30} />;
                                                       }}
                                                       dropdownIconPosition={'left'}
                                                      dropdownStyle={styles.dropdown1DropdownStyle}
                                                     rowStyle={styles.dropdown1RowStyle}
                                                      rowTextStyle={styles.dropdown1RowTxtStyle}/>
    </View>
    <View style={{flex: 0.5}}>
        <Text style={{ marginTop: 20 , marginBottom:9, fontSize:10 }}>Estimate maintenance fee:</Text> 
        <TextInput
                style={styles.number}
                  placeholder="1"
                  autoCompleteType="tel"
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                  onChangeText={setMaintenanceFee}
                />   
              </View>                    

      </View>
      
        
     
    
<TouchableOpacity
        onPress={handleSubmit}
         style={{
        color: '#F7A10D' ,
        marginTop: 20 ,
        borderRadius: 4 , 
        height: 45 , 
        alignItems: 'center',
        justifyContent:"center",
        backgroundColor:  '#F7A10D',
        borderRadius: 8
      }}
        >
          <Text style={styles.buttonText}>Get in Touch with a Lawyer</Text>
        </TouchableOpacity>
        
 {/**
    <Provider>
      <Portal>
            
      

        <Modal visible={visible} onDismiss={hideModal} 
                    contentContainerStyle={{
                      backgroundColor: 'white', 
                      height: '20%', 
                      justifyContent: 'center',
                      alignItems:"center",
                      marginHorizontal: 50,
                      borderRadius:5
                    }}>
                  <AntDesign style={styles.edit} name={'checkcircle'} size={25}  color={'rgb(136, 153, 166)'}/>
                    <Text style={{fontSize: 17 , fontWeight: "400" , marginTop:10}}>Application Successful</Text>

                    <Text style={{fontSize: 12 , fontWeight: "400" , marginTop:10}}>
                    Thank you for getting in {`\n`} 
                      touch with us, a  lawyer will get{`\n`}
                      in touch with you on via whatsapp/text.{`\n`}

                    </Text>
                  
                    <TouchableOpacity style={{justifyContent:"center", 
                                alignItems:"center", 
                                backgroundColor:"#F7A10D",
                                width: '30%',
                                height: 45 ,
                                padding: 10,
                                borderRadius: 2,
                                alignItems: 'center',
                                  marginTop: 20 
                                             }}
                           onPress={setValue(false)}                  
                                                      
                                                      >
                    <Text style={{fontSize: 17 , fontWeight: "400" , color:"white" }}>Back</Text>
                    </TouchableOpacity>

                  
                    
      </Modal>

     </Portal>
     
    </Provider>
     */}
      
     
      
    </View>
   
      
    </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
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
    number: {
      backgroundColor: 'white',
      
      height:50,
     
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
     
  
  
    },
    dropdown1BtnStyle: {
      width: '45%',
      height: 50,
      backgroundColor: '#FFF',
      borderWidth: 1,
       borderColor: '#E6E6E7'
    
      
      
    },
    numberChild:{
      width: '90%',
      height: 50,
      backgroundColor: '#FFF',
      borderWidth: 1,
       borderColor: '#E6E6E7'

    },
    selectInput:{
      width: '100%',
      height: 50,
      backgroundColor: '#FFF',
      borderWidth: 1,
       borderColor: '#E6E6E7'

    },
    dropdown1BtnTxtStyle: { textAlign: 'left',left:15, fontSize: 12},
    dropdown1DropdownStyle: {backgroundColor: '#EFEFEF' , borderRadius: 3},
    dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
    dropdown1RowTxtStyle: { textAlign: 'left', fontSize:12 , padding: 5},
  
    dropdown2BtnStyle: {
      width: '80%',
      height: 50,
      backgroundColor: '#EFEFEF' ,
      borderRadius: 8,
    },
    dropdown2BtnTxtStyle: {
      color: '#FFF',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '12'
    },
    dropdown2DropdownStyle: {
      backgroundColor: '#EFEFEF' ,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
    dropdown2RowStyle: {backgroundColor: '#EFEFEF' , borderBottomColor: '#C5C5C5'},
    dropdown2RowTxtStyle: {
      color: '#FFF',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '12'
    },
  
    dropdown3BtnStyle: {
      width: '80%',
      height: 50,
      backgroundColor: '#FFF',
      paddingHorizontal: 0,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: '#F7A10D',
    },
    dropdown3BtnChildStyle: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 18,
    },
    dropdown3BtnImage: {width: 45, height: 45, resizeMode: 'cover'},
    dropdown3BtnTxt: {
      color: '#F7A10D',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 24,
      marginHorizontal: 12,
    },
    dropdown3DropdownStyle: {backgroundColor: 'slategray'},
    dropdown3RowStyle: {
      backgroundColor: 'slategray',
      borderBottomColor: '#F7A10D',
      height: 50,
    },
    dropdown3RowChildStyle: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 18,
    },
    dropdownRowImage: {width: 45, height: 45, resizeMode: 'cover'},
    dropdown3RowTxt: {
      color: '#F1F1F1',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 24,
      marginHorizontal: 12,
    },
  
    dropdown4BtnStyle: {
      width: '50%',
      height: 50,
      backgroundColor: '#FFF',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#F7A10D',
    },
    dropdown4BtnTxtStyle: {color: '#F7A10D', textAlign: 'left'},
    dropdown4DropdownStyle: {backgroundColor: '#EFEFEF'},
    dropdown4RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
    dropdown4RowTxtStyle: {color: '#F7A10D', textAlign: 'left'},
    innerContainer: {
      borderColor: "green",
    
      borderWidth: 0,
      height: "auto",
      backgroundColor:"white",
      padding: 5
    },
  })