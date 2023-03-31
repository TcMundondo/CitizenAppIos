
import { useNavigation , useRoute } from '@react-navigation/core'
//import { Camera, CameraType } from 'expo-camera';
import React, { Component } from "react";
import { StyleSheet, Image, View, Platform ,SafeAreaView,  ScrollView ,TextInput, TouchableHighlightBase ,TouchableOpacity} from 'react-native'
import { Card, Title, Paragraph ,IconButton } from 'react-native-paper';
//import { TextInput } from 'react-native-paper';
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 
import { Button } from 'react-native-paper';
import db from '../firebase';
import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
import { Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


import EvilIcons from 'react-native-vector-icons/EvilIcons';


import SelectDropdown from 'react-native-select-dropdown';


import * as ImagePicker from 'expo-image-picker';

import BottomNavBar from './components/bottomNavBar'
import uuid from "uuid";
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { RadioButton, Text } from 'react-native-paper';
import { Avatar} from 'react-native-paper';
import { getAuth } from "firebase/auth";
import Entypo from 'react-native-vector-icons/Entypo';
import { Video } from 'expo-av';




const {width} = Dimensions.get('window');

//import ImageUpload from "./components/ImageUpload";

class ReportScreen extends Component { 
   constructor(props) {
  super(props);
  
  this.state = {value: '',
               category:'',
               image: null ,
               uploading: false,
               uploadedImage:'',
               uploadUrl:'',
               categories:["Abuse of state Resources","Public Finance Manangement","Health Governance","Service Delivery"],
               displayName:"",
               email:'',
               photoURL:'',
               hashtags: [],
               inputValue: '',
               videoUri:'',
               uploadingVideo:false,
               uploadedVideo: null,
               verified: false,
               checked: false




            };
  //this.inputRef = this.inputRef.bind(this) ;
   this.inputRef = React.createRef();          
  this.handleChange = this.handleChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
  this.pickImage = this.pickImage.bind(this);
  this.uploadImageAsync = this.uploadImageAsync.bind(this);
  this._handleImagePicked= this._handleImagePicked.bind(this);
  this._takePhoto= this._takePhoto.bind(this);
  this.handleCategory= this.handleCategory.bind(this);
  this.cancelPost= this.cancelPost.bind(this);

  this.updateHashtags = this.updateHashtags.bind(this);

  this.pickVideo = this.pickVideo.bind(this);

  this.getHashtags= this.getHashtags.bind(this);
}
/*
inputRef (){
  return  createRef(); 
}*/

  async componentDidMount() {
    

    if (Platform.OS !== "web") {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
      
    }

    this.inputRef.current.focus();

   const auth = getAuth();
    const user = auth.currentUser;
    const email = user.email ;
    const displayName = user.displayName;
    const photoURL = user.photoURL;

    this.setState({
     displayName: displayName,
     photoURL: photoURL,
     email: email,

    
  
  });


  }
  async pickVideo (){

    try{

     this.setState({checked: true});

      this.setState({uploadingVideo: true});

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    this.setState({videoUri: result.assets[0].uri});
  
    if (!result.canceled) {

      const uploadUrlVideo = await this.uploadVideoAsync(result.assets[0].uri);

      // TODO: Upload the video to a server or store it locally
    }} catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally { this.setState({uploadingVideo: false});

    }
  };
  




  handleChange(value) {
    this.setState({value: value});
    this.setState({checked: true});
    
  }
  handleCategory(category){
    this.setState({category: category}) ;
  }
  cancelPost(){
    this.setState({
      value: '',
      image:''

    
  
  });
  }

/******************************************************************************************************************************************** */
  async handleSubmit(event) {
    const { value, category } = this.state;

    // Validate input data
    if (!value) {
      return alert("Report field is required");
    }
    if (!category) {
      return alert("Category field is required");
    }

    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    const email = user.email ;
    const displayName = user.displayName;
    const photoURL = user.photoURL;
   
    try {
      alert('A  report submitted: ' + this.state.value);
      event.preventDefault();
      const docRef = await addDoc(collection(db, "reports"), {
        report: this.state.value,
        image:  this.state.uploadedImage,
        category: this.state.category,
        userId: uid,
        UserName: displayName,
        userPhoto: photoURL,
        createdAt: serverTimestamp(),
        hashtags : this.state.hashtags,
        video: this.state.uploadedVideo,
        verified: this.state.verified

       
      });
     
      this.setState({
        value: '',
        image:''
  
      
    
    });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
   
  }
  async _takePhoto() {

   {/** 
const [statusCamera, requestPermission] = ImagePicker.useCameraPermissions();
    if (statusCamera !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }  
  */} 
   
     this.setState({checked: true});

    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    this.setState({image: pickerResult.assets[0].uri});

    this._handleImagePicked(pickerResult);
  }

/******************************************************************************************************************************************** */

  async pickImage () {

    this.setState({checked: true});
    try{
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
   

    console.log(result);
   

    if (!result.canceled) {
      this.setState({image: result.assets[0].uri});
      this._handleImagePicked(result);

    }

  }
  catch (e) {
    console.error("picking image error: ", e);
  } 
}
/******************************************************************************************************************************************** */
getHashtags = () => {
  const regex = /(?:^|\s)(#[A-Za-z\d-]+)/g;
  const matches = this.state.value.match(regex);
  const newHashtags = matches ? matches.map((match) => match.trim()) : [];
  return newHashtags;
}

/******************************************************************************************************************************************** */
updateHashtags = () => {
  const newHashtags = this.getHashtags();
  this.setState({ hashtags: newHashtags });
}

/******************************************************************************************************************************************** */
async _handleImagePicked(pickerResult){
  try {
   this.setState({ uploading: true });

    if (!pickerResult.cancelled) {
      const uploadUrl = await this.uploadImageAsync(pickerResult.uri);
      this.setState({ uploadUrl: uploadUrl });
    }
  } catch (e) {
    console.log(e);
    alert("Upload failed, sorry :(");
  } finally {
    this.setState({ uploading: false });
  }
};

/******************************************************************************************************************************************** */

async uploadImageAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileRef = ref(getStorage(), uuid.v4());
  const result = await uploadBytes(fileRef, blob);

  // We're done with the blob, close and release it
  blob.close();

  const uploadedImage = await getDownloadURL(fileRef);
  this.setState({uploadedImage: uploadedImage});
}

/******************************************************************************************************************************************** */

/******************************************************************************************************************************************** */

async uploadVideoAsync(uri) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const fileRef = ref(getStorage(), uuid.v4());
  const result = await uploadBytes(fileRef, blob);

  // We're done with the blob, close and release it
  blob.close();

  const uploadedVideo = await getDownloadURL(fileRef);
  
  this.setState({uploadedVideo: uploadedVideo });

}

/******************************************************************************************************************************************** */


  render() {
    const {photoURL ,displayName ,email , value , checked} = this.state ;
    return (
      <SafeAreaView style={styles.container}>
       <ScrollView style={styles.scrollView}>
        <View>
         
        <View style={styles.innerContainer}>
            
            <View style={styles.info}>
               <View style={{ marginRight: 7}}>
                  {photoURL? <Image
                        source={{uri: photoURL}} 
                        style={styles.photo}/> : <Image
                        source={require('../assets/citizen1.png')}
                        style={styles.photo}/>}  
                </View>
          
                    <View style={styles.userDetails}>
                      <View style={{flex: 1,flexDirection: 'row' , alignItems: "center",justifyContent: 'flex-end', }}>
                    
                         <SelectDropdown 
                                        borderWidth={0}
                                         borderColor={'transparent'}
                                         data={this.state.categories}
                                                 onSelect={(selectedItem, index) => {
                                                         console.log(selectedItem, index);
                                                         this.setState({category: selectedItem})
                                                       }}
                                                       defaultButtonText={"Abuse of state Resources"}
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
                                                       dropdownIconPosition={'right'}
                                                      dropdownStyle={styles.dropdown1DropdownStyle}
                                                     rowStyle={styles.dropdown1RowStyle}
                                                      rowTextStyle={styles.dropdown1RowTxtStyle}
                             
                                           />
                                 
                       {!checked? <Button   onPress={this.handleSubmit} color={'#F7A10D'} style={styles.button} mode="outlined"> post </Button>: 
                        
                        <Button   onPress={this.handleSubmit} color={'#F7A10D'} style={styles.button} mode="contained"> post </Button> 

                       }     
                                       
                       
                        </View>

                  <Text style={styles.postCatagory}>Hello Citizen.Share with us the information you have?</Text>
                     </View>
                   </View>
              </View>
        </View>
            <View> 
                      <TextInput
                        ref={this.inputRef}
                        multiline={true}
                        style={styles.dialogInputText}
                         value={this.state.value} 
                         onEndEditing={this.updateHashtags}
                        onChangeText={this.handleChange}
                        
                        />

                        {this.state.uploading? (<ActivityIndicator animating={true}  />) : null}
                        <View style={styles.viewContainer}>  
                        {this.state.image? ( <Card.Cover  style={{ borderCurve: 5, marginHorizontal: 10 ,marginTop:5}} source={{ uri: this.state.image}} />) : null}
                           
                        {this.state.uploadingVideo? (<ActivityIndicator animating={true}  />) : null}
                            {this.state.videoUri? 
                           
                            <Video

                                style={{ width: '60%', height: 300 , marginBottom: 2,marginTop:5 , marginHorizontal: 60 , borderRadius:10}}
                              source={{ uri: this.state.videoUri }}
                              resizeMode="stretch"
                                   shouldPlay
                                    useNativeControls
                              
                            />
                            
                            : null}
                    <Card.Actions style={styles.moveAction}>  
                      <MaterialIcons style={{paddingHorizontal:10}} name={'photo-camera'} onPress={this._takePhoto}  size={24} color={'#F7A10D'}/>
                      <Ionicons style={{ paddingHorizontal:10 , borderWidth:0}} name={'image'} onPress={this.pickImage}  size={24} color={'#F7A10D'}/>

                      <Entypo style={{ paddingHorizontal:10}} name={'video-camera'} onPress={this.pickVideo}  size={24} color={'#F7A10D'}/>
                 
                 
                   </Card.Actions>                   
                           </View>
                </View>
                 
                  

            
                            
                      
                
                  
                
                
               
                 
          </ScrollView>
      
</SafeAreaView>
    )
  }
}
export  function ReportWithProps(props){
  const navigation = useNavigation();
  const route = useRoute();






 return(
  <ReportScreen navigation={navigation} route={route} />
 )
}

export default ReportScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white"
   // paddingTop: StatusBar.currentHeight,
   

  },
  viewContainer:{
    flex: 1,
    backgroundColor: 'white',
    padding:5
    
  },
  bar: {
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
   
    alignItems: 'center',
  },
  radio: {
  
    padding: 15,
   
 
  },
  scrollView: {
  
    marginHorizontal: 0,
    height:'80%'
  },
  dialogInputText:{
    paddingHorizontal: 10,
    width:"160%",
    paddingTop:10,
    backgroundColor:'white',
    backgroundColor: 'transparent',
    borderWidth: 0 ,
    maxWidth: width
  
  
  
  },
  moveAction:{
    justifyContent:"center",
    alignItems:"center",
    justifyContent: "space-evenly",
  },
  selectDrop:{
    width:"200%",
    justifyContent:'center',
    right: 80 ,

  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
  },

   button: {
  
  
  
   
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    
    borderColor: "#F7A10D",
    marginLeft: 'auto',
   
    
   
    
  
  },
  buttonContaner:{
    flex: 2, 
    alignItems: 'center',
    flexDirection: "row"
  },
  headerTitle: {color: '#000', fontWeight: 'bold', fontSize: 16},
  saveAreaViewContainer: {flex: 1, backgroundColor: '#FFF'},
  viewContainer: {flex: 1, width, backgroundColor: '#FFF'},
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '10%',
    paddingBottom: '20%',
  },

  dropdown1BtnStyle: {
    width: '70%',
    height: 30,
    backgroundColor: '#FFF',
  
    
    borderColor: '#F7A10D',
  },
  dropdown1BtnTxtStyle: {color: '#F7A10D', textAlign: 'left',left:15, fontSize: 12},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF' , borderRadius: 3},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: { textAlign: 'left', fontSize:12 , padding: 5},

  dropdown2BtnStyle: {
    width: '80%',
    height: 50,
    backgroundColor: '#F7A10D',
    borderRadius: 8,
  },
  dropdown2BtnTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '12'
  },
  dropdown2DropdownStyle: {
    backgroundColor: '#F7A10D',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dropdown2RowStyle: {backgroundColor: '#F7A10D', borderBottomColor: '#C5C5C5'},
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
  modalContainer:{
    
    borderColor: "green",
    flexDirection: "row",
    borderWidth: 0,
    height: "90%",
    backgroundColor:"white"
  },
  photoContainer: {
    flex: 0.23,
    borderColor: "yellow",
    flexDirection: "column",
    borderWidth: 0
  },
  innerPhotoContainer: { height: 100, alignItems: "center" },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginTop:2
   
  },
  info: {
    flex: 0.70                                                                                                                   ,
    borderColor: "yellow",
    flexDirection: "row",
    alignItems: 'center',
    borderWidth: 0
  },
  userDetails: {
    flex: 1,
    borderWidth: 0,
    marginBottom: 5
  },
  userName: { color: "black", fontWeight: "bold" , fontSize: 16},
  userHandleAndTime: {
    color: "rgb(136, 153, 166)",
    marginLeft: 5
  },
  postCatagory: {
    marginTop: 5 ,
  
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: 'left',

  
  },
  

})