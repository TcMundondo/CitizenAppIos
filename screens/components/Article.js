import { useNavigation , useRoute } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, 
          View  , 
          FlatList, 
          SafeAreaView, 
          TouchableHighlight,
          TouchableOpacity, 
          Image

} from 'react-native'





import { collection, collectionGroup,
   getDocs ,addDoc , query, where 
        ,getCountFromServer ,
        orderBy, 
        limit  
        , startAt 
  } from "firebase/firestore";

import { Avatar, Button, Card,  Paragraph , Text} from 'react-native-paper';

import { Divider} from 'react-native-paper';
import { IconButton, MD3Colors } from 'react-native-paper';
import { Dialog, Portal} from 'react-native-paper';
import { ScrollView } from 'react-native';
import { TextInput ,Modal} from 'react-native-paper';
import db from '../../firebase'
import { ActivityIndicator } from 'react-native-paper';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { doc, updateDoc ,increment } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore"; 
import { Dimensions , Share} from 'react-native';
import uuid from "uuid";
import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from "firebase/auth";
import { async } from '@firebase/util';
 import { Video } from 'expo-av';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';













class Article extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      reports: [],
      visible: false,
      currentItems: {},
      value:"",
      docId: null,
      thread: null,
      threadValue: "",
      lastVisible:"",
      touched: "", tweet: "", upVote: false, downVote: false ,
      name: "", handle: "", time: "" , liked:false, photo: "",
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      visible: false,
      uploadedImage:null,
      image:null,
      visits: 0,
      
    
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeThread= this.handleChangeThread.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.currentItem = this.currentItem.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitThread = this.handleSubmitThread.bind(this);
    this.submitUpVote = this.submitUpVote.bind(this);
    this.submitDownVote = this.submitDownVote.bind(this);
    this.onClosingState = this.onClosingState.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.onShare = this.onShare.bind(this);
    this._takePhoto = this._takePhoto.bind(this);
    this.pickImage  = this.pickImage.bind(this);
    this._handleImagePicked  = this._handleImagePicked.bind(this);
    this.uploadImageAsync = this.uploadImageAsync.bind(this);
    this._Visits = this._Visits.bind(this) ;


   
  }
  componentDidMount() {
    const { navigation } = this.props;

     this.focusListener = navigation.addListener('focus', () => {
      //this.setState({ visits: this.state.visits + 1 });
      this._Visits();
    });


  }
  async _Visits(){
    const docRef = doc(db, "reports" , this.props.itemId );
       await updateDoc(docRef, {
      visits: increment(1)
    });
    console.log("visited thread");

  }

  componentWillUnmount() {
    this.focusListener();
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
  async onShare() {
    try {
    
      const  result = await Share.share({
        message:
          'https://play.google.com/store/apps/details?id=com.CitizenApp',
      });
   ;

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }
  hideModal() {
    this.setState({visible: false })
    console.log('Modal just closed');
  }

  showModal() {
    this.setState({visible: true })
    console.log('Modal just opened');
  }

  onClosingState(state) {
    console.log('the open/close of the swipeToClose just changed');
  }



hideDialog(){
  this.setState({visible: false});
}
handleChange(value) {
  this.setState({value: value});
  
}
handleChangeThread(threadValue) {
  this.setState({threadValue: threadValue});
  
}
async currentItem(item , id , thread ){
  const {navigation , itemId , data} = this.props ;
  await this.setState({currentItems: item});
  await this.setState({docId: id}) ;
  await this.setState({thread: thread}) ;
  console.log(this.state.currentItems) ;
  //this.setState({visible: true});
  navigation.navigate('AddToThread' , {
    navigation: navigation ,
    itemId: itemId ,
    data: data 
  }) ;
}

async handleSubmit(event) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    const email = user.email ;
    const displayName = user.displayName;
    const photoURL = user.photoURL;
    alert('A comment  was submitted: ' + this.state.value);
    event.preventDefault();
    const docRef = await addDoc(collection(db, "reports" ,this.state.docId ,"comments" ), {
      comment: this.state.value,
      docId: this.state.docId ,
      image:  this.state.uploadedImage,
      userId: uid,
      UserName: displayName,
      userPhoto: photoURL,
      createdAt: serverTimestamp(),

  
    
     
    });
   
    console.log("Document written with ID: ", docRef.id);
    this.setState({visible: false});
  } catch (e) {
    console.error("Error adding document: ", e);
  }
 
}

async submitUpVote(id){
  try {

    this.setState(prevState => ({
      upVote: !prevState.isToggled,
    }));
const docRef = doc(db, "reports" , id );
    await updateDoc(docRef, {
      upVote: increment(1)
    });
   
   
    console.log("Document written with ID: ", docRef.id);
    this.setState({visible: false});
  } catch (e) {
    console.error("Error adding document: ", e);
  }

}

async submitDownVote(id){
  try {
   // this.setState({downVote: true}) ;
    this.setState(prevState => ({
      downVote: !prevState.isToggled,
    }));
   
  


    
   
   
    const docRef = doc(db, "reports" , id );
    await updateDoc(docRef, {
      downVote: increment(1)
    });
   
   
    console.log("Document written with ID: ", docRef.id);
    this.setState({visible: false});
  } catch (e) {
    console.error("Error adding document: ", e);
  }

}
async handleSubmitThread(event) {
  const { value, threadValue } = this.state;

  // Validate input data
  
  if (!threadValue) {
    return alert("thread field is required");
  }
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    const email = user.email ;
    const displayName = user.displayName;
    const photoURL = user.photoURL;
    alert('Threed was submitted: ' + this.state.threadValue);
    event.preventDefault();
    const docRef = await addDoc(collection(db, "reports" ,this.state.docId ,"thread" ), {
      thread: this.state.threadValue,
      docId: this.state.docId ,
      image:  this.state.uploadedImage,
      userId: uid,
      UserName: displayName,
      userPhoto: photoURL,
      createdAt: serverTimestamp(),
    
  
    
     
    });
   
    console.log("Document written with ID: ", docRef.id);
    this.setState({visible: false});
  } catch (e) {
    console.error("Error adding document: ", e);
  }
 
}

  

  render() {
    const {navigation,data , itemId , theardCount} = this.props
    const {touched, tweet,  likes, name, handle, time,  liked, photo} = this.state

  return (
    <View style={{backgroundColor:"white"}}>
 <TouchableHighlight>  
  <View style={{flex:1 , marginTop:10 , paddingHorizontal: 21}}>    
      <View style={styles.innerContainer}>
            
      <View style={styles.info}>
         <View style={{ marginRight: 7}}>
            {data.userPhoto? <Image
                  source={{uri: data.userPhoto}} 
                  style={styles.photo}/> : <Image
                  source={require('../../assets/citizen1.png')}
                  style={styles.photo}/>}  
          </View>
    
              <View style={styles.userDetails}>
              {data.UserName?
                <Text style={styles.userName}>{data.UserName}{"\n"}
                  <Text style={styles.postCatagory}>{data.category}</Text>
                </Text>
                 
                  : <Text style={styles.userName}>Anonymous Citizen{"\n"}
                      <Text style={styles.postCatagory}>{data.category}</Text>
                   </Text>
                
                }
                
              </View>

            
           
            
            </View>
            </View>
          
          <View style={styles.tweetTextContainer}>
           <View style={{ flexDirection:"row" , alignItems:"center"}}>
              <Text style={styles.tweetText}>{data.report}</Text>  
          </View>
              {data.image === "" || data.image === null ?  null :(<Card.Cover source={{ uri: data.image }} style={styles.roundImage}/>)}
              {data.video == "" || data.video == null ? null:
               <Video 
               style={{ width: '95%', height: 300 , marginBottom: 2,marginTop:5 ,  borderRadius:4,
               borderRadius: 4, marginTop:2,}}
               source={{ uri: data.video}}
               resizeMode="stretch"
               shouldPlay
               useNativeControls/> 
               }   
              <View style={styles.tweetActionsContainer}>
              <EvilIcons name={'eye'} size={25} color={'rgb(136, 153, 166)'}/>
              <Text>{data.visits}</Text>
              <Text style={styles.userHandleAndTime}> {new Date(data.createdAt.toDate()).toDateString()}</Text>
   
              
              </View>
              <Divider/>
              <View style={{ flex: 1, flexDirection: 'column',alignItems: 'center',justifyContent: 'center',}}>

              
              <View style={styles.tweetActionsContainer}>
              <TouchableOpacity style={styles.likeButton}>
              { data.verified? 
               <MaterialIcons style={{marginLeft:5}} name={'verified'} size={16} color={'#F7A10D'}/>
                                        :
               <MaterialIcons style={{marginLeft:5}} name={'verified'} size={16} color={'rgb(136, 153, 166)'}/>
              
              }
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> {this.submitDownVote( itemId )}}  style={styles.likeButton}>
              
              { this.state.downVote ? 
                

                <EvilIcons name={'arrow-down'} size={25} style={{marginLeft:4}} color={this.state.downVote  ? '#F7A10D'  : 'rgb(136, 153, 166)'}/>
                :
                <EvilIcons name={'arrow-down'} size={25} color={this.state.downVote  ? '#F7A10D'  : 'rgb(136, 153, 166)'}/>
              
              }
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {this.currentItem(this.props.data ,this.props.itemId , true) ;}}  style={styles.retweetButton}>
                <EvilIcons name={'plus'} size={25} color={(this.props.theardCount) ? '#F7A10D' :'rgb(136, 153, 166)'}/>
                
               </TouchableOpacity>
              <TouchableOpacity onPress={()=> {this.submitUpVote( itemId )}}  style={styles.likeButton}>
              { this.state.upVote? 
                <EvilIcons name={'arrow-up'} size={25} style={{marginLeft:4}} color={this.state.upVote  ? '#F7A10D'  : 'rgb(136, 153, 166)'}/>
                :
                <EvilIcons name={'arrow-up'} size={25} color={this.state.upVote  ? '#F7A10D'  : 'rgb(136, 153, 166)'}/>
              
              }
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {this.onShare()}} style={styles.shareButton}>
    
                <SimpleLineIcons name={'share'} size={16} color={'rgb(136, 153, 166)'}/>
              
              </TouchableOpacity>
            </View>
          <Divider/>
          {/********************************************************************************************************************* */}
          <Divider/>
              <View style={styles.tweetActionsContainer}>
              <View style={[styles.actionWords,]}>
              { data.verified?  
              <Text style={{color:'#F7A10D' ,fontWeight:"300", fontSize: 10}}>Verified</Text>
             
                                        :
            <Text style={{color: "grey",fontWeight:"300", fontSize: 10}}>Unverified</Text>
              
              }
              </View>
              <View onPress={()=> {this.submitDownVote( itemId )}}   style={[styles.actionWords, {right: 20}]}>
              
              <Text style={{color: this.state.downVote ? '#F7A10D' : "grey",fontWeight:"blod", fontSize: 10}}>{data.downVote}</Text>
              
              <Text style={{color: this.state.downVote ? '#F7A10D' : "grey",fontWeight: "300",paddingLeft: 2 , fontSize: 10}}>Downvotes</Text>
             
              </View>
              <View    style={[styles.actionWords, {right: 15}]}>
              
              <Text style={{color: theardCount ? '#F7A10D' : "grey",fontWeight:"blod", fontSize: 10}}>{theardCount}</Text>
              
              <Text style={{color: theardCount ? '#F7A10D' : "grey",fontWeight:"300",paddingLeft: 2 ,  fontSize: 10}}>Threads</Text>
              
              
              </View>
              <View onPress={()=> {this.submitUpVote( itemId )}}  style={[styles.actionWords, {right: 15}]}>
              
              <Text style={{color: this.state.upVote ? '#F7A10D' : "grey",fontWeight:"blod", fontSize: 10}}>{data.upVote} </Text>

              <Text style={{color: this.state.upVote ? '#F7A10D' : "grey",fontWeight:"300",paddingLeft: 1, fontSize: 10}}>Upvotes</Text>
              </View>
              
            </View>
            </View>
          <Divider/>
        </View>

            
           
           
            
           
            
            
            </View> 
       </TouchableHighlight> 
    
            

          

  



           
           
        
    
      
                      
   
       

  
    
     
    </View>

 
    
    

    
  )
 }




}



export default Article

const styles = StyleSheet.create({
  container: {
    height: '90%'
    
  }, container2: {
   flex: 1
    
  },
  portal:{
    width:'full' ,
    height:"170%"
  },
  reportHearder:{
    paddingLeft: 60,
  },
  button: {
  
  
    backgroundColor: '#F7A10D',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    width:'100%',
    
   
    
  
  },
  bgColor: {
    backgroundColor:'white',
    borderRadius: 10,
  },
  card:{
    borderBottomWidth:1,
    
    borderTopWidth:5,
    padding: 15,
    borderColor:'white'
  },
  cardContent:{
    paddingLeft: 40,
   justifyContent:"center"


  },
  roundImage:{
    borderRadius: 10,
    width:'100%',
    marginTop:2 ,
    marginBottom:5
   
  },
  moveText:{
    padding:5
  },
  moveAction:{
    padding:0,
    justifyContent: "space-between",
  },
  app: {
    flex: 2, 
    alignItems: 'center',
    flexDirection: "row"
  },
  appCommentHeader:{
    flexDirection: "row",
    alignItems: 'center',
   
  },
  appContent:{
    flexDirection: "row",
    alignItems: 'center',

  },
  appCommentHeaderText:{
      padding:10
  },
  appComent:{
    paddingTop:10 ,
    flex: 2, 
    marginHorizontal: "auto",
    width: 400,
    alignItems: 'flex-start',
    

    flexDirection: "row"


  },
  UserText:{
    paddingLeft: 10
  },
  CommentText:{
    paddingLeft: 0,
    right:40
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
   
   
    backgroundColor:'white',
  
  
  },
  bottomFAB: {
    right: 130 ,
    height: "full"
  },

   innerContainer: {
    borderColor: "green",
  
    borderWidth: 0,
    height: "auto",
    backgroundColor:"white",
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
    color: "rgb(136, 153, 166)",
  
  },
  tweetTextContainer: { flex: 1,borderWidth: 0 ,  backgroundColor:"white" , marginTop:24 },
  tweetText: { color: "black", fontSize: 18},
  showThread: { color: "#ADD8E6", paddingRight: 10 , marginBottom:5 , marginTop:5},
  tweetActionsContainer: {
    
    borderColor: "blue",
    borderWidth: 0,
    marginTop: 5,
    flexDirection: "row",
    paddingBottom: 5,
   

  },
  commentButton: {
    paddingLeft: 0,
    flex: 0.25,
    alignItems: "center",
    flexDirection: "row",
    borderColor: "red",
    borderWidth: 0
  },
  commentButtonIcon: {
    margin: 0,
    marginLeft: -4,
    borderColor: "red",
    borderWidth: 0
  },
  commentsCount: {
    position: "absolute",
    left: 27,
    color: "rgb(136, 153, 166)",
    marginLeft: -4
  },
  retweetButton: {
    padding: 5,
    flex: 0.25,
    alignItems: "center",
    flexDirection: "row",
    borderColor: "red",
    borderWidth: 0
  },
  retweetButtonIcon: {
    position: "absolute",
    left: 27,

    marginLeft: 3
  },
  likeButton: {
    padding: 5,
    flex: 0.25,
    alignItems: "center",
    flexDirection: "row",
    borderColor: "red",
    borderWidth: 0
  },
  actionWords: {
    
    flex: 0.25,
    alignItems: "center",
    flexDirection: "row",
    borderColor: "red",
    borderWidth: 0

  },
  likeButtonIcon: {
    position: "absolute",
    left: 27,

    marginLeft: 3
  },
  shareButton: {
    padding: 5,
    
    alignItems: "center",
    flexDirection: "row",
    borderColor: "red",
    borderWidth: 0
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  modal2: {
    height: 430,
    backgroundColor: "#3B5998"
  },
  row: {
   
    flexDirection: 'row',
    
   
    justifyContent: "space-between",
    alignItems: "center"
  }


})