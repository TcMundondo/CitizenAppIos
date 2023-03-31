
import { useNavigation , useRoute } from '@react-navigation/core'
import React, { Component } from "react";
import { StyleSheet, Image, View, Platform ,SafeAreaView,  ScrollView ,TextInput, TouchableHighlightBase ,TouchableOpacity} from 'react-native'
import { Card, Title, Paragraph ,IconButton } from 'react-native-paper';
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; 
import { Button } from 'react-native-paper';
import db from '../../firebase';
import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
import { Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';
import { Permissions } from 'expo';
import * as ImagePicker from 'expo-image-picker';


import uuid from "uuid";
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { RadioButton, Text } from 'react-native-paper';
import { Avatar} from 'react-native-paper';
import { getAuth } from "firebase/auth";
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Video } from 'expo-av';



const {width} = Dimensions.get('window');
/******************************************************************************************************************************************** */


//import ImageUpload from "./components/ImageUpload";

class AddToThreadScreen extends Component { 
   constructor(props) {
  super(props);
  
  this.state = {value: '',
               category:'',
               image: null ,
               uploading: false,
               uploadedImage:'',
               uploadUrl:'',
               displayName:"",
               email:'',
               photoURL:'',
               videoUri:'',
               uploadingVideo:false,
               uploadedVideo: null,
               hashtags: [],
               verified: false
               

            };
  /******************************************************************************************************************************************** */
          
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
  this.uploadVideoAsync = this.uploadVideoAsync.bind(this) ;

}
/*
inputRef (){
  return  createRef(); 
}*/
/******************************************************************************************************************************************** */

  async componentDidMount() {
    

    if (Platform.OS !== "web") {
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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



/******************************************************************************************************************************************** */

  handleChange(value) {
    this.setState({value: value});
    
  }
  /******************************************************************************************************************************************** */

  handleCategory(category){
    this.setState({category: category}) ;
  }
  /******************************************************************************************************************************************** */

  cancelPost(){
    this.setState({
      value: '',
      image:''

    
  
  });
  }
/******************************************************************************************************************************************** */

  async handleSubmit(event) {
    const { value, category } = this.state;
    const {data , itemId } = this.props ;

    // Validate input data
    if (!value) {
      return alert("AddToThread field is required");
    }
  

    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    const email = user.email ;
    const displayName = user.displayName;
    const photoURL = user.photoURL;
   
    try {
      alert('A Thread submitted: ' + this.state.value);
      event.preventDefault();
      const docRef = await addDoc(collection(db, "reports" , itemId ,"thread" ), {
        thread: this.state.value,
        category: data.category,
        image:  this.state.uploadedImage,
        userId: uid,
        UserName: displayName,
        userPhoto: photoURL,
        createdAt: serverTimestamp(),
        hashtags : this.state.hashtags,
        video: this.state.uploadedVideo,
        docId: itemId,
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

async _takePhoto() {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
    this.setState({image: pickerResult.assets[0].uri});

      this._handleImagePicked(pickerResult);
  }
  /******************************************************************************************************************************************** */


  async pickImage () {
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

async pickVideo (){

  try{

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
    const {photoURL ,displayName ,email} = this.state ;
    const {navigation , data ,itemId } = this.props ;
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
                        source={require('../../assets/citizen1.png')}
                        style={styles.photo}/>}  
                </View>
          
                    <View style={styles.userDetails}>
                      <View style={{flex: 1,flexDirection: 'row' , alignItems: "center",justifyContent: 'flex-end', }}>
                              <Text> {data.category}</Text>
                                 
                        <Button   onPress={this.handleSubmit} color={'#F7A10D'} style={styles.button} mode="outlined"> post </Button>         
                                       
                       
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
                         onEndEditing={this.updateHashtags}
                         value={this.state.value} 
                        onChangeText={this.handleChange}
                        />

                        {this.state.uploading? (<ActivityIndicator animating={true}  />) : null}
                        <View style={styles.viewContainer}>  
                     
                     
                        {this.state.image? ( <Card.Cover  style={{ borderCurve: 5, marginHorizontal: 10 ,marginTop:5}} source={{ uri: this.state.image}} />) : null}

                        {this.state.uploadingVideo? (<ActivityIndicator animating={true}  />) : null}
                        {this.state.videoUri? 
                        <Video style={{ width: '60%', height: 300 , marginBottom: 2,marginTop:5 , marginHorizontal: 60 , borderRadius:10}} source={{ uri: this.state.videoUri }}
                             resizeMode="stretch"
                             shouldPlay
                             useNativeControls /> : null}

      <View style={styles.innerContainer2}>
         <View style={styles.info}>
            <View>
                <View
                
                onPress={() => {}}>
                
                  {data.userPhoto? <Image
                  source={{uri: data.userPhoto}} 
                  style={styles.photo}/> : <Image
                  source={require('../../assets/citizen1.png')}
                  style={styles.photo}/> }  
                </View>
              </View>

    
              <View style={styles.userDetails}>
              {data.UserName?
                <View>
                <View style={{flex: 1 , flexDirection:'row', alignSelf: 'flex-start'}}>
                 <Text style={styles.userName}> {data.UserName}</Text>
                 <View style={{flex: 1, alignItems: 'flex-end'}}>
               <Entypo  style={{marginLeft:20}} 
             name={'dots-three-vertical'} size={12} color={"grey"}/>
              </View>
              </View>   
              <View style={{flex: 1 , flexDirection:'row', alignSelf: 'flex-start'}}>
              <Text style={styles.postCatagory}>{data.category}</Text>


              <View style={{flex: 1, alignItems: 'flex-end'}}>

              <Text style={styles.userHandleAndTime}>  {new Date(data.createdAt.toDate()).toDateString()} </Text>
              </View>
                
              </View>              
                  
          
          
          
            
            </View>
                  :
                  <View>
                    <View style={{flex: 1 , flexDirection:'row', alignSelf: 'flex-start'}}>
                     <Text style={styles.userName}>Anonymous </Text>
                     <View style={{flex: 1, alignItems: 'flex-end'}}>
                   <Entypo   style={{marginLeft:20}} 
                 name={'dots-three-vertical'} size={12} color={"grey"}/>
                  </View>
                  </View>   
                  <View style={{flex: 1 , flexDirection:'row', alignItems: 'baseline'}}>
                  <Text style={styles.postCatagory}>{data.category}</Text>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>

                  <Text style={styles.userHandleAndTime}>  {new Date(data.createdAt.toDate()).toDateString()} </Text>
                  </View>
                    
                  </View>              
                      
              
              
              
                
                </View>}
                
              </View>
            </View>
          
            <View style={styles.tweetTextContainer}>
            <View style={{ flexDirection:"row" , alignItems:"center"}}>
              <Text style={styles.tweetText}>{data.report}
             
              
              </Text>  
              <Text>
               

              </Text>
              </View>
              {data.image == ""?  null: (<Card.Cover age  source={{ uri: data.image }} style={styles.roundImage}/>)}
              {data.video? 
               <Video 
               style={{ width: '95%', height: 300 , marginBottom: 2,marginTop:5 ,  borderRadius:4,
               borderRadius: 4, marginTop:2,}}
               source={{ uri: data.video}}
               resizeMode="stretch"
               useNativeControls/> : null
               }   
        </View>

            </View>
                    <Card.Actions style={styles.moveAction}>  
                      <EvilIcons style={{paddingHorizontal:10}} name={'camera'} onPress={this._takePhoto}  size={30} color={'#F7A10D'}/>
                      <EvilIcons style={{ paddingHorizontal:10}} name={'image'} onPress={this.pickImage}  size={30} color={'#F7A10D'}/>
                      <Ionicons style={{ paddingHorizontal:10}} name={'videocam-outline'} onPress={this.pickVideo}  size={30} color={'#F7A10D'}/>
                  </Card.Actions>                   
                              
              
                        
                     

                      
                    
                    
                       
                                
                                     
                         



                    

                       
                      
                      
                      

            
                    </View>
                 
                  

            
                            
                      
                
                  
                
                
               </View>
                 
          </ScrollView>
      
</SafeAreaView>
    )
  }
}
export  function AddToThreadWithProps(props){
  const navigation = useNavigation();
  const route = useRoute();

  const { itemId, data } = route.params;






 return(
  <AddToThreadScreen navigation={navigation} route={route} itemId={itemId}  data={data} />
 )
}

export default AddToThreadScreen

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
    alignItems:"center"
    //justifyContent: "space-between",
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
    width: '60%',
    height: 30,
    backgroundColor: '#FFF',
    borderRadius: 8,
    
    borderColor: '#F7A10D',
  },
  dropdown1BtnTxtStyle: {color: '#F7A10D', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#F7A10D', textAlign: 'left', },

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
  innerContainer2: {
    borderColor: "grey",
  
    borderWidth: 1,
    height: "auto",
    backgroundColor:"white",
    margin: 20,
    padding:5,
    borderRadius: 10,
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
    alignItems: 'flex-start',
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
    
    fontSize: 8
  },
  postCatagory: {
    marginTop: 5 ,
    color: "rgb(136, 153, 166)",
  
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: 'left',

  
  },
  

})