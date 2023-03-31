import { useNavigation , useRoute } from '@react-navigation/core'
import React, { PureComponent } from 'react';
import { StyleSheet, 
          View  , 
          FlatList, 
          SafeAreaView,TouchableHighlight
        } from 'react-native'
import BottomNavBar from './components/bottomNavBar'
import { collection, collectionGroup, getDocs , query, where  ,getCountFromServer ,limit  , startAt 
  } from "firebase/firestore";
import { Divider} from 'react-native-paper';
import db from '../firebase';
import { ActivityIndicator } from 'react-native-paper'
import JobApply from './components/JobApply';
import NetworkError from './components/NetworkError';
import NoJobs from './components/NoJobs';
//import AppHeaderWithSearch from './components/AppHeaderWithSearch';
/*********************************************************************************************************************************** */

class JobsResults extends PureComponent{



  constructor(props) {
    super(props);
    this.state = {
      currentItems: {}, // current report data 
      value:"", // value of the comment 
      docId: null, // document id 
      lastVisible:"", // last visible document 
      networkError: false,
      Given: false ,
    
    };
  }
 
  render() {
 const { navigation , jobs } = this.props ;
 const { networkError} = this.state ;

  return (

    <View style={styles.container2}>
      
      {networkError?<NetworkError navigation={navigation}/>: 
       <SafeAreaView style={styles.container}>

       {this.state.jobs.length === 0?
        <View>
          <ActivityIndicator animating={true} size={'large'} /> 
          
       </View>
       : null }
            <FlatList 
            numColumns={1}
           //key={jobs.id}
            
            data={jobs} 
           // onEndReached = { this.handLoadMore }
            onEndReachedThreshold = { 0 }
            renderItem={({ item  }) => ( 
             
                  <TouchableHighlight>
                   <View> 
                  <JobApply navigation={navigation}  data={item.data} itemId={item.id}/>
                 <Divider/>
              </View>
                </TouchableHighlight>
            
            )}
          /> 
    </SafeAreaView>
       }
        <BottomNavBar/>   
    </View>
    
  )
 }

}






  /*********************************************************************************************************************************** */


export  function  JobsResultsWithProps(props){
  const navigation = useNavigation();
  const route = useRoute();
 
  const { jobs} = route.params;





 return(
  <JobsResults navigation={navigation} route={route} />
 )
}


  /*********************************************************************************************************************************** */

//export default React.memo(JobsWithProps);




  /*********************************************************************************************************************************** */

const styles = StyleSheet.create({
  container: {
    height: '90%'
    ,
    backgroundColor:"white"
    
  }, container2: {
   flex: 1,
   backgroundColor:"white"
    
  },
  reportHearder:{
    paddingLeft: 60,
  },
   button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
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
    marginTop:2
   
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
    width:"160%",
    paddingTop:10,
    backgroundColor:'white',
  
  
  },
  bottomFAB: {
    
    right: 130 ,
  
    height: "full"
  
   
  
     
  
  
       
   },

   innerContainer: {
    flex: 1,
    borderColor: "green",
    flexDirection: "row",
    borderWidth: 0,
    height: "auto",
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
    marginTop: 15
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
  tweetTextContainer: { flex: 1, borderColor: "blue", borderWidth: 0 },
  tweetText: { color: "black", paddingRight: 10 },
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
  }

})