import { useNavigation , useRoute } from '@react-navigation/core'
import React from 'react'
import { StyleSheet,TouchableOpacity, View  , FlatList, SafeAreaView,ImageBackground  } from 'react-native'
import { app } from '../firebase'
import BottomNavBar from './components/bottomNavBar'
import { getAuth, signOut , updateProfile} from "firebase/auth";
import { collection, getDocs ,addDoc} from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Button, Card, Title, Paragraph , Text} from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import db from '../firebase';
import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
import uuid from "uuid";
import { ActivityIndicator, MD2Colors  } from 'react-native-paper';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Content from './components/Content';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Header } from 'react-native-elements';








class EditedProfileScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      userId:null ,
      userEmail:null,
      image: null ,
      userName: null,
      Bio:null,
      uploading: false,
      uploadedImage:'',
      uploadUrl:'',
      searchQuery: '',
      image:'',
     
    
    };
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleChangeBio = this.handleChangeBio.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.pickImage = this.pickImage.bind(this);
    this.uploadImageAsync = this.uploadImageAsync.bind(this);
    this._handleImagePicked= this._handleImagePicked.bind(this);
    this._takePhoto= this._takePhoto.bind(this);
    this.updateUser= this.updateUser.bind(this);
    this.updateBio= this.updateBio.bind(this);

   
  

   
  }
  handleChangeUserName(userName) {
    this.setState({userName: userName});
    
  }
  handleChangeBio(Bio) {
    this.setState({Bio: Bio});
    
  }
  handleChangeEmail(userEmail) {
    this.setState({userEmail: userEmail});
    
  }
  updateUser(){
    const auth = getAuth();
      updateProfile(auth.currentUser, {
        displayName: this.state.userName, 
        photoURL: this.state.uploadedImage,
        email: this.state.userEmail,
        bio: this.state.Bio

      }).then(() => {
        // Profile updated!
        console.log("profile updated") ;
        this.updateBio() ;
        this.props.navigation.replace("Profile");
       
        // ...
      }).catch((error) => {
        // An error occurred
        // ...
      });
  }
  async updateBio(){
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    const docRef = await addDoc(collection(db, "userBio"), {
      bio: this.state.Bio,
      userId: uid
     
    });

    //this.props.navigation.replace("Profile");
  }

  async componentDidMount() {
    if (Platform.OS !== "web") {
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
    try{
     // const { itemId, otherParam } = route.params;
         const auth = getAuth();
        const user = auth.currentUser;
        const uid = user.uid;
        const email = user.email ;
        const displayName = user.displayName;
        const photoURL =  user.photoURL;
        const bio = user.bio;
       
    this.setState({
      userId: uid ,
      userEmail: email,
      image: photoURL,
      userName: displayName,
      Bio: bio


    })
         
   
      


  
} 
   

  catch (e) {
    console.log(e) ;

  } 
}


async _takePhoto() {
  let pickerResult = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
  });
  this.setState({image: pickerResult.assets[0].uri});

  this._handleImagePicked(pickerResult);
}

async pickImage () {
  try{
    console.log('in picker') ;
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
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







  

  render() {
    const {navigation} = this.props ;
    const {image} = this.state ;

  return (
    <View style={styles.container2}>
         <SafeAreaView style={styles.container}>
                  <Header   containerStyle={{
                    backgroundColor: 'white',
                    justifyContent: 'space-around',}}
          

            centerComponent={
              <Text styles={{
                alignItems:"center",
                alignSelf:'center',
                alignItems:'center',
               
                fontSize:22,
                fontWeight:'700'
                }}> Edit Profile </Text>
            }
          
          
            
            rightComponent={

              <TouchableOpacity onPress={this.updateUser} >
            
                  <Text  style={{ color: '#F7A10D'  , fontWeight: 'bold'}}> Save </Text>  
             </TouchableOpacity>
            
            }
            centerContainerStyle={{ 
              alignItems:"center",
              alignSelf:'center',
              alignItems:'center',
              fontSize:22,
              fontWeight:'bold'}}
              rightComponentStyle={{flex:4 ,alignItems:"center",
              alignSelf:'center',
              alignItems:'center',
              marginLeft: 3
             
            }}
            
          />
         <Card style={{padding:10  }}>
          <View style={styles.appCommentHeader} >
            <View onPress={this.pickImage}>
              {this.state.uploading? (<ActivityIndicator animating={true}  />) : null}

            {image? <ImageBackground 
            imageStyle={{ borderRadius: 8 ,}}
            source={{ uri: image }} 
            style={{width: 100, height: 100 ,borderRadius: 10 , marginTop: 5 }}>
            <View style={{alignItems: 'center', justifyContent:'center' , marginTop: 20}}>

            <EvilIcons style={{paddingHorizontal:10}} name={'camera'} onPress={this.pickImage}  size={60} color={'white'}/>
            </View>
          </ImageBackground>
            : <ImageBackground 
            imageStyle={{ borderRadius: 8 ,}}
            source={require('../assets/citizen1.png')}
            style={{width: 100, height: 100 ,borderRadius: 10 , marginTop: 5 }}>
            <View style={{alignItems: 'center', justifyContent:'center' , marginTop: 20}}>

            <EvilIcons style={{paddingHorizontal:10}} name={'camera'} onPress={this.pickImage}  size={60} color={'white'}/>
            </View>
          </ImageBackground>}  
                
                
              </View> 
              
           </View>

              <Card.Content style={{marginRight: 5}}>
              <TextInput
                        multiline={true}
                         style={styles.dialogInputText}
                        label="User Name"
                        value={this.state.userName} 
                        onChangeText={this.handleChangeUserName}
                        />
               <TextInput
                        multiline={true}
                         style={styles.dialogInputText}
                        label="bio"
                        value={this.state.Bio} 
                        onChangeText={this.handleChangeBio}
                        />
                <TextInput
                        multiline={true}
                         style={styles.dialogInputText}
                        label="email"
                        value={this.state.userEmail} 
                        onChangeText={this.handleChangeEmail}
                        />          
                     
                       

                  </Card.Content>
                     
                      
        </Card>
           
          
   
      </SafeAreaView>
      

      <BottomNavBar/>  
    
     
    </View>
    
  )
 }




}

export  function EditedProfileScreenProps(props){
  const navigation = useNavigation();
  const route = useRoute();
 


  
  



 return(
  <EditedProfileScreen navigation={navigation} route={route}/>
 )
}

export default EditedProfileScreen

const styles = StyleSheet.create({
  container: {
    height: '90%',
    marginHorizontal: 5
    
  }, container2: {
   flex: 1
    
  },
  button: {
  
  
  
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width:'70%'
   
    
  
  },
  bgColor: {
    backgroundColor:'white',
  },
  card:{
    borderBottomWidth:1,
    
    borderTopWidth:5,
    padding: 15,
    borderColor:'white'
  },
  cardContent:{
    paddingLeft: 40,

  },
  roundImage:{
    borderRadius: 10,
  },
  moveText:{
    padding:5
  },
  moveAction:{
    padding:0,
    justifyContent: "space-between",
  },
  app: {
    flex: 2, // the number of columns you want to devide the screen into
    marginHorizontal: "auto",
    width: 400,
    alignItems: 'center',
    

    flexDirection: "row"
  },
  appCommentHeader:{
    justifyContent:'center',
    alignItems: 'center',

   
  },
  appCommentHeaderText:{
      padding:10
  },
  appComent:{
    paddingTop:10 ,
    flex: 2, // the number of columns you want to devide the screen into
    marginHorizontal: "auto",
    width: 400,
    alignItems: 'flex-start',
    

    flexDirection: "row"


  },
  UserText:{
    paddingLeft: 10
  },
 
  dialogText:{
    paddingLeft:0,
    left:0
  },
  smallImage:{
   
    borderRadius: 10,
   
    height: 100,
    width: 100,
    left: 30
    
  },
  hidden: {
    width: 0,
    height: 0,
  },
  dialogInputText:{
    width:"160%",
    paddingTop:10,
    backgroundColor:'white',
    paddingBottom:10
  
  
  },

})