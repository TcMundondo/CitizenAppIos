import React, { Component } from 'react';
import { useNavigation , useRoute } from '@react-navigation/core'

import { StyleSheet, 
          View  , 
          FlatList, 
          SafeAreaView, 
          Animated,
          TouchableHighlight,
          TouchableOpacity, 
          Image,Linking,
          
} from 'react-native'
import { collection, collectionGroup,
   getDocs ,addDoc , query, where 
        ,getCountFromServer ,
        orderBy, 
        limit  
        , startAt 
  } from "firebase/firestore";
import { Button, Card, Provider,  Text} from 'react-native-paper';
import { Divider} from 'react-native-paper';
import { IconButton, MD3Colors } from 'react-native-paper';
import { Dialog, Portal} from 'react-native-paper';
import { ScrollView } from 'react-native';
import { TextInput ,Modal} from 'react-native-paper';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { doc, updateDoc ,increment } from "firebase/firestore";
import { Dimensions , Share} from 'react-native';
import uuid from "uuid";
import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import BottomNavBar from './components/bottomNavBar';



const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width




  /*********************************************************************************************************************************** */











class JobDisplay extends React.Component{


  /*********************************************************************************************************************************** */

  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: false,

    
    };
    this.onShare = this.onShare.bind(this);

  }

  /*********************************************************************************************************************************** */
  
 


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
  

  render() {
 const { data , itemId , navigation} = this.props ;
 const {applicationLink} =  data ;

 //const dueDate = new Date(data.dueDate.toDate()).toLocaleDateString('en-GB');


  return (
   
  
    <View style={styles.container2}>
         <SafeAreaView style={styles.container}>
          <ScrollView>

         <View style={styles.info}>
            <View style={styles.userDetails}>
              <View style={styles.header}>
  
                <Text style={styles.userName}>{data.jobTitle}</Text>

                <Text style={styles.postCatagory}>{data.organisation}</Text>
              </View>
              <Text style={styles.tweetText}>
               {data.organisationAbout}
          </Text> 

             </View>
            </View>
   
     <View style={styles.tweetActionsContainer}>
      <TouchableOpacity onPress={() => {}} style={styles.shareButton}>
            <EvilIcons name={'location'} size={25} color={'#F7A10D'}/>
               <Text style={{color: "#000000", fontSize:11}}>{data.location.charAt(0).toUpperCase() + data.location.slice(1)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} style={styles.shareButton}>
            <EvilIcons name={'clock'} size={25} color={'#F7A10D'}/>
            <Text style={{color: "#000000" , fontSize:11}}>{data.experience} years exp.</Text>    
            </TouchableOpacity>
           <TouchableOpacity onPress={() => {}} style={styles.shareButton}>
            <EvilIcons name={'calendar'} size={25} color={'#F7A10D'}/>
              <Text style={{color: "#000000" , fontSize:11}} >{data.dueDate}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}} style={[styles.shareButton]}>
          
            <SimpleLineIcons name={'wallet'} size={16} color={'#F7A10D'}/>
               <Text style={{color: "#000000" , paddingLeft: 2 ,fontSize:11}}>${data.salary}</Text>
            </TouchableOpacity>
            </View>
        <View style={styles.tweetTextContainer}>
        <View >
                <Text style={styles.tweetText}>
                  <Text style={{fontWeight: "bold" }}>Job Description:</Text>
                  
               
                </Text>
               <Text style={{ marginHorizontal: 5 , fontWeight:'normal', paddingHorizontal:5}}>{data.jobDescription}</Text>
              </View>
           </View>
             <View style={styles.header}>
              <TouchableOpacity onPress={() => {
          Linking.openURL(applicationLink);
        }} style={styles.button}>
                      <Text style={styles.buttonText}>Apply</Text>
                </TouchableOpacity>
              </View>
              </ScrollView>
           </SafeAreaView>
           
       </View>
     
 

 
    
    

  )
 }

}




export  function JobDisplayWithProps(props){
  const navigation = useNavigation();

  const route = useRoute();
  const { itemId, data  } = route.params;






 return(
  <JobDisplay navigation={navigation}  itemId={itemId} data={data}/>
 )
}

  /*********************************************************************************************************************************** */


  export default  JobDisplay;



/*********************************************************************************************************************************** */
const styles = StyleSheet.create({
  container: {
    height: '90%',
   backgroundColor:"white",
   marginHorizontal: 5
  },
   container2: {
   flex:1,
   backgroundColor:"white",
   
  },
  header:{
   justifyContent: 'center',
    alignItems: 'center',
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
    width: '40%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
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
    width:'95%',
    marginTop:2,
    marginBottom:10
   
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


innerContainer: {
    flex: 1,
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
    borderColor: "yellow",
    borderWidth: 0,
    marginTop:5,
   },
  userDetails: {
    borderColor: "blue",
    borderWidth: 0,
    marginBottom: 5
  },
  userName: { color: "black", fontWeight: "bold" , fontSize: 20 },
  userHandleAndTime: {
    color: "rgb(136, 153, 166)",
    textAlign: 'right',
  },
  postCatagory: {
   
    color: "rgb(136, 153, 166)",
  
  },
  tweetTextContainer: { borderColor: "blue", borderWidth: 0 },
  tweetText: { color: "black", padding: 5 },
  showThread: { color: "#ADD8E6", paddingRight: 10 , marginBottom:5 , marginTop:5},
  tweetActionsContainer: {
    
    borderColor: "blue",
    borderWidth: 0,
    marginTop: 5,
    flexDirection: "row",
    paddingBottom: 5,
    justifyContent:'space-evenly'
  },
  commentButton: {
    paddingLeft: 0,
    alignItems: "center",
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
    padding: 5,
    
    alignItems: "center",
    flexDirection: "row",
    borderColor: "red",
    borderWidth: 0
  },
  share: {
    padding: 5,
    flex: 0.25,
    alignItems: "center",
    flexDirection: "row",
    borderColor: "red",
    borderWidth: 0,
    marginRight: 5
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