


/*********************************************************************************************************************************** */
import { useNavigation , useRoute } from '@react-navigation/core'
import React, { PureComponent } from 'react';
import { StyleSheet, 
          View  , 
          ImageBackground,
          SafeAreaView, 
          TouchableOpacity,
          Text,
          ScrollView,
          
        } from 'react-native'






/*********************************************************************************************************************************** */











class CommunitiesCom extends PureComponent{


  /*********************************************************************************************************************************** */

  constructor(props) {
    super(props);
    this.state = {
    
    };
  }
 
   
  /*********************************************************************************************************************************** */
  


render() {

const {navigation} = this.props ;
  return (
 <View style={{flex: 1 , paddingHorizontal:20}}>
    <Text style={{fontSize: 16,textAlign: "center", color: 'black' , fontWeight:'normal' , marginBottom: 10 , marginTop:5 }}>
        Discover new Communities</Text>
    <TouchableOpacity  style={{marginVertical:10}} onPress={() => navigation.navigate('Community' , {category: 'Abuse of state Resources'})}>
        <ImageBackground 
          imageStyle={{ borderRadius: 8}}
          source={require('../../assets/com1.png')}
          style={{width: '100%', height: 120 ,borderRadius: 10 , marginTop: 5 }}>
          <View style={{alignItems: 'center', justifyContent:'center' , marginTop: 40}}>
            <Text style={{fontSize: 18,textAlign: 'center', color: '#fff' , justifyContent:'center'}}>State Resources</Text>
          </View>
        </ImageBackground>
 </TouchableOpacity>

 <TouchableOpacity style={{marginVertical:5}} onPress={() => navigation.navigate('Community' , {category: 'Public Finance Manangement'})}>
        <ImageBackground
            imageStyle={{ borderRadius: 8}}
           
          source={require('../../assets/com2.png')}
          style={{width: '100%', height: 120 ,borderRadius: 8, marginTop: 5 }}
        >
          <View style={{alignItems: 'center', justifyContent:'center' , marginTop: 40}}>
            <Text style={{fontSize: 18, textAlign: 'center', color: '#fff' }}>Public Funds</Text>
          </View>
        </ImageBackground>
 </TouchableOpacity>
 
<TouchableOpacity style={{marginVertical:5}} onPress={() => navigation.navigate('Community' , {category: 'Health Governance'})}>
        <ImageBackground
        imageStyle={{ borderRadius: 8}}
         source={require('../../assets/com5.png')}
        style={{width: '100%', height: 120 ,borderRadius: 8, marginTop: 5 }}>
          
          <View style={{alignItems: 'center',marginTop: 40  }}>
            <Text style={{fontSize: 18,justifyContent:'center' ,textAlign: 'center', color: '#fff'}}>Health Governance</Text>
          </View>
        </ImageBackground>
  </TouchableOpacity>
<TouchableOpacity style={{marginVertical:5}} onPress={() => navigation.navigate('Community' , {category: 'Service Delivery'})}>
        <ImageBackground
        imageStyle={{ borderRadius: 8}}
         source={require('../../assets/com4.png')}
        style={{width: '100%', height: 120 ,borderRadius: 8, marginTop: 5 }}>
          
          <View style={{alignItems: 'center',marginTop: 40  }}>
            <Text style={{fontSize: 18,justifyContent:'center' ,textAlign: 'center', color: '#fff'}}>Service Delivery</Text>
          </View>
        </ImageBackground>
</TouchableOpacity>
    </View>

  )
 }

}





/*********************************************************************************************************************************** */

 export default CommunitiesCom;




  /*********************************************************************************************************************************** */

const styles = StyleSheet.create({
   container2: {
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