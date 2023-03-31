import { useNavigation , useRoute } from '@react-navigation/core'
import React, { Component } from "react";
import { StyleSheet, Image, View, Platform ,SafeAreaView,  ScrollView ,StatusBar, FlatList,TouchableOpacity ,TouchableHighlight} from 'react-native'
import { Card, Title, Paragraph ,IconButton } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore"; 
import { Button } from 'react-native-paper';
import db from '../firebase';
import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
import { Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';
import { Divider} from 'react-native-paper';
import { getAuth } from "firebase/auth";


import * as ImagePicker from 'expo-image-picker';


import uuid from "uuid";
import { ActivityIndicator} from 'react-native-paper';

import { serverTimestamp} from "firebase/firestore";

import { Headline, Caption, useTheme, } from 'react-native-paper';



const {width} = Dimensions.get('window');



class BlockUser extends Component { 
   constructor(props) {
  super(props);
  
  this.state = {value: '',
               category:'',
               image: null ,
               uploading: false,
               uploadedImage:'',
               uploadUrl:'',
               messages:[]

              

            };
  this.handleChange = this.handleChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);
   this.handleCategory= this.handleCategory.bind(this);

}

  handleChange(value) {
    this.setState({value: value});
    
  }
  handleCategory(category){
    this.setState({category: category}) ;
  }
  async handleSubmit(event) {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const uid = user.uid;
 
  
      


    
      event.preventDefault();
      alert('you blocked user : ' + this.props.user) ;
      const docRef = await addDoc(collection(db, "BlockedUsers"), {
        message: this.state.value,
        blockerId: user.uid,
        blockedUserId: this.props.user,
        createdAt: serverTimestamp(),
      

      
       
      });
      this.setState({image: ''});
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
   
  }










  render() {
    const {user} = this.props ;
    return (
     <View style={styles.container}>
      <SafeAreaView style={styles.container2}>
      <View style={styles.viewContainer}>
           
           <Card style={styles.viewContainer}>
                 <Headline style={styles.centerText}>
                   user potential violation of user policy
                 </Headline>
                 <Caption style={styles.centerText}>
                   will not see any content from user with id {user} 
                  
                 </Caption>
                
                 <Card.Content>
               
               
                 </Card.Content>
              
                 
     <TouchableOpacity
                   style={styles.button}
             
                   onPress={this.handleSubmit}>
              
               <Button color='grey' style={styles.button} mode="contained" >block {user}</Button>
         </TouchableOpacity>
               
                 
         
                
                 
             </Card>
             <Divider /> 
            
            
            </View>
                 
        
          
                   
              
             
         
          
        
        </SafeAreaView>
    
 </View>
    )
  }
}

export  function BlockUserWithProps(props){
  const navigation = useNavigation();
  const route = useRoute();
  const { itemId, user } = route.params;





 return(
  <BlockUser navigation={navigation} route={route} itemId={itemId}  user={user}/>

 )
}

export default BlockUser

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // paddingTop: StatusBar.currentHeight,
   

  },
  container2: {
    height: '90%'
    
  },
  viewContainer:{
    flex: 1,
  },
  scrollViewContent: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
    backgroundColor:'white'
  },
  button: {
  
  
  
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width:'100%'
   
    
  
  },

  viewContainer2:{
    flex: 1,
    paddingTop:10
  },
  messageText:{
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
    width:"160%",
    paddingTop:10,
    backgroundColor:'white',
  
  
  
  },
  moveAction:{
    padding:0,
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
  app: {
    flex: 2, // the number of columns you want to devide the screen into
    marginHorizontal: "auto",
    width: 400,
    alignItems: 'flex-start',
    

    flexDirection: "row"
  },
  appCommentHeader:{
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
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},

  dropdown2BtnStyle: {
    width: '80%',
    height: 50,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  dropdown2BtnTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dropdown2DropdownStyle: {
    backgroundColor: '#444',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dropdown2RowStyle: {backgroundColor: '#444', borderBottomColor: '#C5C5C5'},
  dropdown2RowTxtStyle: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  dropdown3BtnStyle: {
    width: '80%',
    height: 50,
    backgroundColor: '#FFF',
    paddingHorizontal: 0,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#444',
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
    color: '#444',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 12,
  },
  dropdown3DropdownStyle: {backgroundColor: 'slategray'},
  dropdown3RowStyle: {
    backgroundColor: 'slategray',
    borderBottomColor: '#444',
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
    borderColor: '#444',
  },
  dropdown4BtnTxtStyle: {color: '#444', textAlign: 'left'},
  dropdown4DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown4RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown4RowTxtStyle: {color: '#444', textAlign: 'left'},
  innerContainer: {
    flex: 1,
    borderColor: "green",
    flexDirection: "row",
    borderWidth: 0,
    height: "auto",
    backgroundColor:"white"
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
    flex: 0.77,
    borderColor: "yellow",
    flexDirection: "column",
    borderWidth: 0
  },
  userDetails: {
    flex: 1,
    borderColor: "blue",
    borderWidth: 0,
    marginBottom: 5
  },
  userName: { color: "black", fontWeight: "bold" },
  userHandleAndTime: {
    color: "rgb(136, 153, 166)",
    marginLeft: 5
  },
  postCatagory: {
    color: "rgb(136, 153, 166)",
  
  },
  tweetTextContainer: { flex: 1, borderColor: "blue", borderWidth: 0 },
  tweetText: { color: "black", paddingRight: 10 },
  showThread: { color: "#ADD8E6", paddingRight: 10 , marginBottom:5 , marginTop:5},
  tweetActionsContainer: {
    flex: 1,
    borderColor: "blue",
    borderWidth: 0,
    marginTop: 5,
    flexDirection: "row",
    paddingBottom: 5
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
  likeButtonIcon: {
    position: "absolute",
    left: 27,

    marginLeft: 3
  },
  shareButton: {
    padding: 5,
    flex: 0.25,
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