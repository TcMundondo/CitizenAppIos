
import React, { PureComponent } from 'react';
import { StyleSheet, 
          View  , 
          TouchableHighlight,
          TouchableOpacity, 
          Image
} from 'react-native'
import { collection,addDoc, DocumentSnapshot } from "firebase/firestore";
import { Button, Card, Provider,  Text} from 'react-native-paper';
import { Divider} from 'react-native-paper';
import { Dialog, Portal} from 'react-native-paper';
import { ScrollView } from 'react-native';
import { TextInput ,Modal} from 'react-native-paper';
import db from '../../firebase'
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { doc, updateDoc ,increment } from "firebase/firestore";
import { Dimensions , Share} from 'react-native';
import uuid from "uuid";
import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore"; 
import { Video } from 'expo-av';

/*********************************************************************************************************************************** */
const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width


/*********************************************************************************************************************************** */

class Content extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
      report: null ,
      comment: null,
      visibleFlag: false,
      visible: false,
      currentItems: {},
      value:"",
      docId: null,
      thread: null,
      threadValue: "",
      lastVisible:"",
      touched: "",
      tweet: "",  downVote: false, upVote: false,
      name: "", handle: "", time: "" , liked:false, photo: "",
      isOpen: false,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3,
      visible: false,
      uploadedImage:null,
      image:null,
      videoUrl: null,
      visibleFullImage: false
      
    
    };

  /*********************************************************************************************************************************** */
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeThread= this.handleChangeThread.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.currentItem = this.currentItem.bind(this);

    this.currentItems = this.currentItems.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitThread = this.handleSubmitThread.bind(this);
    this.submitUpVote = this.submitUpVote.bind(this);
    this.onClosingState = this.onClosingState.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.onShare = this.onShare.bind(this);
    this._takePhoto = this._takePhoto.bind(this);
    this.pickImage  = this.pickImage.bind(this);
    this._handleImagePicked  = this._handleImagePicked.bind(this);
    this.uploadImageAsync = this.uploadImageAsync.bind(this);
    this._hideModal = this._hideModal.bind(this);
    this._showModal = this._showModal.bind(this);
    this.submitDownVote = this.submitDownVote.bind(this);

  /*********************************************************************************************************************************** */

   
  }



  /*********************************************************************************************************************************** */

  _showModal(){
    this.setState({  visibleFlag: true });
  } 


  /*********************************************************************************************************************************** */
  _hideModal(){
    this.setState({  visibleFlag: false });
  } 

  /*********************************************************************************************************************************** */
  async _takePhoto() {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    this.setState({image: pickerResult.assets[0].uri});

    this._handleImagePicked(pickerResult);
  }

  /*********************************************************************************************************************************** */

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

/*********************************************************************************************************************************** */

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

/*********************************************************************************************************************************** */


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


/*********************************************************************************************************************************** */
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

  /*********************************************************************************************************************************** */
  hideModal() {
    this.setState({visible: false })
    console.log('Modal just closed');
  }

  /*********************************************************************************************************************************** */

  showModal() {
    this.setState({visible: true })
    console.log('Modal just opened');
  }

  /*********************************************************************************************************************************** */

  onClosingState(state) {
    console.log('the open/close of the swipeToClose just changed');
  }

  /*********************************************************************************************************************************** */



hideDialog(){
  this.setState({visible: false});
}

/*********************************************************************************************************************************** */
handleChange(value) {
  this.setState({value: value});
  
}

/*********************************************************************************************************************************** */
handleChangeThread(threadValue) {
  this.setState({threadValue: threadValue});
  
}

/*********************************************************************************************************************************** */
async currentItem(item , id ,comment , thread , report){
  await this.setState({currentItems: item});
  await this.setState({docId: id}) ;
  await this.setState({comment: comment}) ;
  await this.setState({thread: thread}) ;
  await this.setState({report: report}) ;
  console.log(this.state.currentItems) ;
  this.setState({visible: true});
}
/*********************************************************************************************************************************** */
/*********************************************************************************************************************************** */
async currentItems(item , id ,comment , thread , report){
  const {navigation , itemId , data} = this.props ;
  await this.setState({currentItems: item});
  await this.setState({docId: id}) ;
  await this.setState({comment: comment}) ;
  await this.setState({thread: thread}) ;
  await this.setState({report: report}) ;
  console.log(this.state.currentItems) ;
  //this.setState({visible: true});
  navigation.navigate('AddToThread' , {
    navigation: navigation ,
    itemId: itemId ,
    data: data 
  }) ;
}

/*********************************************************************************************************************************** */

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

/*********************************************************************************************************************************** */
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
   // this.setState({visible: false});
  } catch (e) {
    console.error("Error adding document: ", e);
  }

}

/*********************************************************************************************************************************** */

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
   // this.setState({visible: false});
  } catch (e) {
    console.error("Error adding document: ", e);
  }

}

/*********************************************************************************************************************************** */



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

/*********************************************************************************************************************************** */

  

  render() {

/*********************************************************************************************************************************** */
    const {navigation , data ,itemId ,commentsCount,theardCount, visibleFullImage } = this.props ;
    const {touched, tweet,  likes, name, handle, time,  liked, photo , visible} = this.state ;

    const createdAt = new Date(data.createdAt.toDate()).toLocaleDateString('en-GB');

/*********************************************************************************************************************************** */

  return (
    <View style={{flex:1 , marginTop:10 , paddingHorizontal: 10}}>
    

      <View style={styles.innerContainer}>
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
               <Entypo onPress={() => {this.currentItem(data , itemId , false , false , true) ;}}  style={{marginLeft:20}} 
             name={'dots-three-vertical'} size={12} color={"grey"}/>
              </View>
              </View>   
              <View style={{flex: 1 , flexDirection:'row', alignSelf: 'flex-start'}}>
              <Text style={styles.postCatagory}>{data.category}</Text>
              <View 
              style={{flex: 1, alignItems: 'flex-end' }}>

              <Text onPress={() => {this.currentItem(data , itemId , false , false , true) ;}}
              style={styles.userHandleAndTime}>  {createdAt} </Text>
              </View>
                
              </View>              
                  
          
          
          
            
            </View>
                  :
                  <View>
                    <View style={{flex: 1 , flexDirection:'row', alignSelf: 'flex-start'}}>
                     <Text style={styles.userName}>Anonymous </Text>
                     <View style={{flex: 1, alignItems: 'flex-end'}}>
                   <Entypo onPress={() => {this.currentItem(data , itemId , false , false , true) ;}}  style={{marginLeft:20}} 
                 name={'dots-three-vertical'} size={12} color={"grey"}/>
                  </View>
                  </View>   
                  <View style={{flex: 1 , flexDirection:'row', alignSelf: 'flex-start'}}>
                  <Text style={styles.postCatagory}>{data.category}</Text>
                  <View 
                  style={{flex: 1, alignItems: 'flex-end'}}>

                  <Text onPress={() => {this.currentItem(data , itemId , false , false , true) ;}}  
                  style={styles.userHandleAndTime}>  {createdAt} </Text>
                  </View>
                    
                  </View>              
                      
              
              
              
                
                </View>}
                
              </View>
            </View>

            <TouchableOpacity onPress={() => {
                         
                         navigation.navigate('Thread', {
                             itemId: itemId,
                             report: data,
                             theardCount:theardCount,
                             
                           });
                         }}> 
          
            <View style={styles.tweetTextContainer}>
            <View style={{ flexDirection:"row" , alignItems:"center"}}>
              <Text style={styles.tweetText}>{data.report.substring(0, 450)}
                {data.report.length >= 450? <Text style={{color:'#F7A10D'}}> Show More</Text> :null} 
                {/** the above line is a brain child of Karim */}
              </Text>  
              <Text>
               

              </Text>
              </View>
              {data.image == "" || data.image == null ?  null: (<Card.Cover age  source={{ uri: data.image }} style={styles.roundImage}/>)}
               {data.video == "" || data.video == null ? null:
               <Video 
               style={{ width: '95%', height: 300 , marginBottom: 2,marginTop:5 ,  borderRadius:4,
               borderRadius: 4, marginTop:2,}}
               source={{ uri: data.video}}
               resizeMode="stretch"
               useNativeControls/> 
               }   
              

            <View style={styles.tweetActionsContainer}>
            <View style={styles.likeButton}>
            { data.verified? 
               <MaterialIcons style={{marginLeft:5}} name={'verified'} size={16} color={'#F7A10D'}/>
                                        :
               <MaterialIcons style={{marginLeft:5}} name={'verified'} size={16} color={'rgb(136, 153, 166)'}/>
              
              }
              </View>
              <TouchableOpacity onPress={()=> {this.submitDownVote( itemId )}}  style={styles.likeButton}>
              { this.state.downVote ? 
                <EvilIcons name={'arrow-down'} size={20}  style={{marginLeft:4}} color={this.state.downVote  ? '#F7A10D'  : 'rgb(136, 153, 166)'}/>
                :
                <EvilIcons name={'arrow-down'} size={20}  color={this.state.downVote  ? '#F7A10D'  : 'rgb(136, 153, 166)'}/>
              
              }
              <Text style={[styles.likeButtonIcon, {color: this.state.downVote ? '#F7A10D' : "grey",fontWeight: "300", fontSize: 12}]}>{data.downVote}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {this.currentItems(this.props.data ,this.props.itemId , true) ;}}  style={styles.retweetButton}>
                <EvilIcons name={'plus'} size={20} color={(this.props.theardCount) ? '#F7A10D' :'rgb(136, 153, 166)'}/>
               {this.props.theardCount == 0? null: <Text style={[styles.retweetButtonIcon, {color: this.props.theardCount? '#F7A10D' : "rgb(136, 153, 166)",fontWeight: true ? "300" : "300",}]}>{this.props.theardCount}</Text>} 
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> {this.submitUpVote( itemId )}}  style={styles.likeButton}>
              { this.state.upVote? 
                <EvilIcons name={'arrow-up'} size={20} style={{marginLeft:4}} color={this.state.upVote  ? '#F7A10D'  : 'rgb(136, 153, 166)'}/>
                :
                <EvilIcons name={'arrow-up'} size={20}  color={this.state.upVote  ? '#F7A10D'  : 'rgb(136, 153, 166)'}/>
              
              }
              <Text style={[styles.likeButtonIcon, {color: this.state.upVote ? '#F7A10D': "rgb(136, 153, 166)",fontWeight: "300", fontSize: 12}]}>{data.upVote}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {this.onShare()}} style={styles.shareButton}>
    
                <EvilIcons name={'share-apple'} size={20} color={'rgb(136, 153, 166)'}/>
              
              </TouchableOpacity>
            
            </View>
    
            </View>

       </TouchableOpacity> 
           

            
            </View>
          
       <Portal style={styles.portal}>
            <Modal visible={this.state.visible} onDismiss={this.hideModal} contentContainerStyle={{
                backgroundColor: 'white', 
                padding: 20, 
                bottom:0,
                position:'absolute',
                borderRadius:5,
                height: '30%', 
                width: '100%',}}>
            {this.state.report? (
                  <View style={{alignContent:"center" ,justifyContent:"center" }}>
                  <TouchableOpacity style={{alignItems:"center" , flexDirection:"row" ,  marginVertical:10}} onPress={() => {   navigation.navigate('ReportPost', {
                           itemId: itemId,
                           report: data,
                          
                         });
                         this.setState({visible: false});
                         }}>
                       <SimpleLineIcons style={{marginHorizontal:5}} name={'flag'} size={16} color={"grey"}/>
                          <Text style={styles.userName}>
                          Report A Post
                         </Text>
                 </TouchableOpacity>

                 <TouchableOpacity style={{alignItems:"center" , flexDirection:"row" , marginVertical:10}} onPress={() => {   navigation.navigate('ReportUser', {
                           itemId: itemId,
                           user: data.userId,
                         
                         });
                         this.setState({visible: false});
                         }}>
                 <SimpleLineIcons style={{marginHorizontal:5}} name={'flag'} size={16} color={"grey"}/>
                     <Text style={styles.userName}>
                              Report User 
                        </Text>
                  </TouchableOpacity>  

                  <TouchableOpacity style={{alignItems:"center" , flexDirection:"row" , marginVertical:10}} onPress={() => {   navigation.navigate('BlockUser', {
                           itemId: itemId,
                           user: data.userId,
                         
                         });
                         this.setState({visible: false});
                         }}>
                    <EvilIcons name={'close-o'} size={25} color={'rgb(136, 153, 166)'}/>

                  <Text style={styles.userName}>
                 
                
                    
                          Block User 
                        </Text>
                    </TouchableOpacity>
                   
                </View>
                    )
                    :null
                  }

             </Modal>
             <Modal visible={visibleFullImage} onDismiss={this.hideModal} contentContainerStyle={{backgroundColor: 'white', padding: 20 , height:"80%"}}>
               

             </Modal>
      </Portal>

      
             
    </View>

 
    
    

    
  )
 }




}


/*********************************************************************************************************************************** */

export default Content

/*********************************************************************************************************************************** */

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
    width:'100%'
   
    
  
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
    borderRadius: 4,
    width:'95%',
    marginTop:2,
    
   
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
    flex: 2, // the number of columns you want to devide the screen into
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
    flex: 1,
    borderColor: "green",
   
    borderWidth: 0,
    height: "auto",
    backgroundColor:"white",
    marginTop: 6
  

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
    borderWidth: 0,
    marginTop:5
  },
  innerPhotoContainer: { height: 100, alignItems: "center" },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginTop:2
   
  },
  info: {
    flex: 1,
    borderColor: "yellow",
    flexDirection: "row",
    borderWidth: 0,
    marginTop:5,
    
  },
  userDetails: {
    flex: 1,
    flexDirection: 'column',
    borderColor: "blue",
    borderWidth: 0,
    marginBottom:5,
    marginLeft:5
  },
  userName: { color: "black", fontWeight: "bold" },
  userHandleAndTime: {
    color: "rgb(136, 153, 166)",
    alignItems:'center',
   
    fontSize: 12,
  

  },
  postCatagory: {
    color: "rgb(136, 153, 166)",
  
  },
  tweetTextContainer: { flex: 1, borderWidth: 0, marginTop: 10 },
  tweetText: { color: "#3C3B3B", paddingRight: 10 , 
},
  showThread: { color: "#ADD8E6", paddingRight: 10 , marginBottom:5 , marginTop:5},
  tweetActionsContainer: {
    flex: 1,
    borderColor: "blue",
    borderWidth: 0,
    marginTop: 1,
    flexDirection: "row",
    paddingBottom: 10,
    justifyContent: "space-between"
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
    padding: 7,
    
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

/*********************************************************************************************************************************** */