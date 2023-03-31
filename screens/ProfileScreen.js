import { useNavigation , useRoute } from '@react-navigation/core';
import React from 'react';
import { StyleSheet,TouchableOpacity,View  , FlatList, SafeAreaView, TouchableHighlight,Image , Share} from 'react-native';
import { app } from '../firebase'
import BottomNavBar from './components/bottomNavBar';
import { getAuth, signOut,deleteUser } from "firebase/auth";
import { collection, getDocs,getDoc ,addDoc , query, where} from "firebase/firestore";
import { Header } from 'react-native-elements';
import { Searchbar } from 'react-native-paper';
import { Avatar, Button, Provider, Text } from 'react-native-paper';
import { Divider} from 'react-native-paper';
import db from '../firebase';
import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
import Content from './components/Content';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { Portal ,Modal} from 'react-native-paper';

import AntDesign from 'react-native-vector-icons/AntDesign';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


import Feather from 'react-native-vector-icons/Feather';

import {updateProfile} from "firebase/auth";











class ProfileScreen extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      userId:null ,
      userEmail:null,
      image:null,
      Bio: [],
      userName:null,
      Info: {},
      reports:[],
      searchQuery: '',
      image:'',
      visible: false,
      SignOutVisible: false,
      DeleteAccountVisible: false
     
    
    };
   
  

   
  }

  async componentDidMount() {
    try{
     // const { itemId, otherParam } = route.params;
    
     const auth = getAuth();
     const user = auth.currentUser;
     const uid = user.uid;
     const email = user.email ;
     const displayName = user.displayName;
     const photoURL = user.photoURL;

    
     this.hideModal = this.hideModal.bind(this);

     this.hideSignOutModal = this.hideSignOutModal.bind(this);
     
     this.hideDeleteAccountModal = this.hideDeleteAccountModal.bind(this);

     this.handleSignOut = this.handleSignOut.bind(this);
     

     this.handleDeleteUser = this.handleDeleteUser.bind(this);

     
    
 this.setState({
   userId: uid ,
   userEmail: email,
   image: photoURL,
   userName: displayName,
  


 }) ;



 
 

 

 const _query = query(collection(db, "reports"), where("userId", "==", uid));
            const querySnapshotReport = await getDocs(_query);
            querySnapshotReport.forEach((doc) => {
              this.setState(
                { reports: [...this.state.reports, {
                  id: doc.id,
                  data: doc.data(),
                

                }] ,
              
              }
              ) ;
              

             

 
 
 


    } );

    console.log(this.state.reports) ;

    
  const q = query(collection(db, "userBio"), where("userId", "==", uid));
  const querySnapshot = await getDocs(q);
   querySnapshot.forEach( (doc) => {
    this.setState(
      { Bio: [...this.state.Bio, {
       id: doc.id,
       data: doc.data(),
      

      }] ,
      Info: doc.data(),
    }
    ) ;
    
 
    console.log(this.state.Info);

 // doc.data() is never undefined for query doc snapshots

 
 
 


    } );

         
   
      


  

   

  }
  catch (e) {
  console.log(e) ;

} 

}

  /*********************************************************************************************************************************** */
  hideModal() {
    this.setState({visible: false })
    console.log('Modal just closed');
  }


 /*********************************************************************************************************************************** */
 hideSignOutModal() {
  this.setState({SignOutVisible: false })
  console.log('Modal just closed');
}
 /*********************************************************************************************************************************** */
 hideDeleteAccountModal() {
  this.setState({DeleteAccountVisible: false })
  console.log('Modal just closed');
}


/*********************************************************************************************************************************** */
handleSignOut(){
  const auth = getAuth();
signOut(auth).then(() => {
this.props.navigation.replace("PhoneVerification")
}).catch((error) => {
// An error happened.
});
console.log('Pressed add')
}

/*********************************************************************************************************************************** */

async handleDeleteUser(){
  const auth = getAuth();
  const user = auth.currentUser;
     const uid = user.uid;
  const docRef = await addDoc(collection(db, "UsersToBeDeleted"), {
   
    userId: uid
   
  });
 
  signOut(auth).then(() => { 
    this.props.navigation.replace("CoverPage")
   
    }).catch((error) => {
    // An error happened.
    });
  
 
}


  

  render() {
    const{navigation} = this.props ;

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
      marginLeft:85,
      fontSize:22,
      fontWeight:'700'
      }}> Profile </Text>
  }
 
 
  
  rightComponent={
  <TouchableOpacity  onPress={() => {this.setState({visible: true })}}>

  <AntDesign  style={styles.edit} name={'setting'} size={25}  color={'rgb(136, 153, 166)'}/>
  

  
</TouchableOpacity>
  }
  centerContainerStyle={{ 
    alignItems:"center",
    alignSelf:'center',
    alignItems:'center',
     fontSize:22,
    fontWeight:'bold'}}
  
/>

         <FlatList 
              numColumns={1}
              
              data={this.state.reports} 
              onEndReached = { this.handLoadMore }
              onEndReachedThreshold = { 0 }
              ListHeaderComponent={()=> ( 

             <View>
              
                <View style={styles.innerContainer}>
            
            <View style={styles.photoContainer}>
                      <View style={styles.innerPhotoContainer}>
                        <TouchableOpacity
                        
                        onPress={() => {}}>
                        
                          {this.state.image? <Image
                          source={{uri: this.state.image}} 
                          style={styles.photo}/> : <Image
                          source={require('../assets/citizen1.png')}
                          style={styles.photo}/>}  
                        </TouchableOpacity>
                      </View>
                    </View>
                          <View style={styles.info}>
                  
                            <View style={styles.userDetails}>
                            {this.state.userName?
                              <Text style={styles.userName}>@{this.state.userName}
                                <Text style={styles.userHandleAndTime}> </Text>
                                <Text style={styles.postCatagory}> {"\n"}{this.state.userEmail}</Text>
                              </Text>
                                : <Text style={styles.userName}>@Anonymous Citizen
                                <Text style={styles.userHandleAndTime}>  </Text>
                                <Text style={styles.postCatagory}> {"\n"} {this.state.userEmail}</Text>
                              </Text>}
                              
                            </View>
                          <View style={styles.tweetTextContainer}>
                                  {this.state.Info.bio?<Text style={styles.tweetText}>
                                                                {this.state.Info.bio}
                                    </Text>: null}  
                            
                                      
                            
                          </View>
                  
                          
                          <Divider />

                          
                              
                              
                    
                          
                          </View>
          </View>  
          <Text style={{fontWeight:"bold" , fontSize:20 ,left:10 ,paddingTop:4}}>Posts</Text>
          <Divider />
        
          </View> ) }
               renderItem={({ item  }) => ( 
                <View>
                  
                 <Divider />
         
                <Content data={item.data} itemId={item.id} theardCount={item.theardCount} commentsCount={item.commentsCount} navigation={this.props.navigation}/>
           
                <Divider />
   
            </View>
              )}
         
            
            />
    <Provider>
      <Portal>
            <Modal visible={this.state.visible} onDismiss={this.hideModal} contentContainerStyle={{
                backgroundColor: 'white', 
                padding: 20, 
                position: 'absolute',
                borderRadius:5,
                top: 50,
                right: 35 ,
                height: '30%', 
                width: '50%',}}>
          <TouchableOpacity style={{flexDirection:"row" , alignItems:"center" }} onPress={() => {this.setState({SignOutVisible: true})}}>
               <FontAwesome style={styles.edit} name={'sign-out'} size={25}  color={'rgb(136, 153, 166)'}/>
               <Text style={{fontSize: 17 , fontWeight: "400" , marginLeft: 5}}>Sign out</Text>
           </TouchableOpacity>

          <TouchableOpacity style={{flexDirection:"row" , alignItems:"center", marginTop:10 }} >
               <FontAwesome style={styles.edit} name={'pencil'} size={25}  color={'rgb(136, 153, 166)'}/>
               <Text  onPress={() => {navigation.navigate('EditedProfile');}} style={{fontSize: 17 , fontWeight: "400" , marginLeft: 5}}>Edit Profile</Text>
           </TouchableOpacity>
           

           <TouchableOpacity style={{flexDirection:"row" , alignItems:"center" , marginTop:10}} onPress={() => {this.setState({DeleteAccountVisible: true})}}>
               <MaterialCommunityIcons style={styles.edit} name={'delete'} size={25}  color={'rgb(136, 153, 166)'}/>
               <Text style={{fontSize: 17 , fontWeight: "400" , marginLeft: 5}} >Delete Account</Text>
           </TouchableOpacity>

           <TouchableOpacity style={{flexDirection:"row" , alignItems:"center" , marginTop:10}} onPress={() => {navigation.navigate("MaintenaceInAction");}}>
               <MaterialIcons style={styles.edit} name={'family-restroom'} size={25}  color={'rgb(136, 153, 166)'}/>
               <Text style={{fontSize: 17 , fontWeight: "400" , marginLeft: 5}} >Maintenace In Action</Text>
           </TouchableOpacity>
        </Modal>
        {/** modal for sign out  */}
        <Modal 
              visible={this.state.SignOutVisible} 
              onDismiss={this.hideSignOutModal} 
              contentContainerStyle={{
                backgroundColor: 'white', 
                height: '30%', 
                justifyContent: 'center',
                alignItems:"center",
                marginHorizontal: 50,
                borderRadius:5
              }}
            >
              <Feather style={{}} name={'power'} size={25}  color={'rgb(136, 153, 166)'}/>
              <Text style={{fontSize: 17 , fontWeight: "400" , marginTop:10}}>Sign out</Text>

              <Text style={{fontSize: 12 , fontWeight: "400" , marginTop:10}}>You will be signing out.</Text>
             
              <TouchableOpacity style={{justifyContent:"center", 
                          alignItems:"center", 
                          backgroundColor:"#C11414",
                          width: '80%',
                          height: 45 ,
                          padding: 10,
                          borderRadius: 2,
                          alignItems: 'center',
                            marginTop: 20 }}
                      onPress={this.handleSignOut}      
                                                >
              <Text style={{fontSize: 17 , fontWeight: "400" , color:"white" }}>Continue</Text>
              </TouchableOpacity>
      </Modal>

        {/** modal for delete Account  */}
        <Modal visible={this.state.DeleteAccountVisible} onDismiss={this.hideDeleteAccountModal} 
                    contentContainerStyle={{
                      backgroundColor: 'white', 
                      height: '20%', 
                      justifyContent: 'center',
                      alignItems:"center",
                      marginHorizontal: 50,
                      borderRadius:5
                    }}
                  >
                  <MaterialCommunityIcons style={styles.edit} name={'delete'} size={25}  color={'rgb(136, 153, 166)'}/>
                    <Text style={{fontSize: 17 , fontWeight: "400" , marginTop:10}}>Delete Account</Text>

                    <Text style={{fontSize: 12 , fontWeight: "400" , marginTop:10}}>Are you sure you want to delete your account {`\n`} 
                        your account  will be  submited to be deleted{`\n`}

                    </Text>
                  <View style={{flexDirection:"row"}}>
                  <TouchableOpacity style={{justifyContent:"center", 
                                alignItems:"center", 
                                width: '30%',
                                height: 45 ,
                                padding: 10,
                                borderRadius: 2,
                                borderWidth:1,
                                borderColor:"#C11414",
                                alignItems: 'center',
                                  marginTop: 20 ,
                                  marginRight:10}}
                                  onPress={this.hideDeleteAccountModal}
                                                      >
                    <Text style={{fontSize: 17 , fontWeight: "400" , color:"black" }}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{justifyContent:"center", 
                                alignItems:"center", 
                                backgroundColor:"#C11414",
                                width: '30%',
                                height: 45 ,
                                padding: 10,
                                borderRadius: 2,
                                alignItems: 'center',
                                  marginTop: 20 
                                             }}
                           onPress={this.handleDeleteUser}                  
                                                      
                                                      >
                    <Text style={{fontSize: 17 , fontWeight: "400" , color:"white" }}>Yes</Text>
                    </TouchableOpacity>

                  </View>
                    
      </Modal>

     </Portal>
     
    </Provider>
            
         
          
          
   
   
         
           

           
          
           
          
   
      </SafeAreaView>
      

      <BottomNavBar/>  
    
     
    </View>
    
  )
 }




}

export  function ProfileWithProps(props){
  const navigation = useNavigation();
  const route = useRoute();






 return(
  <ProfileScreen navigation={navigation} route={route} />
 )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    height: '100%'
    
  },

   button: {
  
  
  
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
   
    
  
  },
  bgColor: {
    backgroundColor:'white',
  },
  container2: {
    flex: 1,

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
  innerContainer: {
    flex: 1,
    borderColor: "green",
    flexDirection: "row",
    borderWidth: 0,
    height: "auto",
    backgroundColor:"white",
    padding:10
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


})