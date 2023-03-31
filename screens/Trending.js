
import { useNavigation , useRoute } from '@react-navigation/core'
import React from 'react'
import { StyleSheet,  TouchableOpacity, View ,  FlatList, SafeAreaView } from 'react-native'
import { Searchbar } from 'react-native-paper';


import BottomNavBar from './components/bottomNavBar';
import db from '../firebase';


import { collection, query, where ,getDocs } from "firebase/firestore";
import { ActivityIndicator } from 'react-native-paper';
import { Divider} from 'react-native-paper';
import { Avatar, Button, Card,  Paragraph , Text} from 'react-native-paper';
import { IconButton, MD3Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from 'react-native-paper';
import Content from './components/Content';
import { getAuth, signOut , updateProfile} from "firebase/auth";




class Trending extends React.Component  {

  constructor(props) {
    super(props);
    this.state = {
    
      searchQuery:'',
      searchDone: false,
      reports: [],

      
    
    };
   
    this.onChangeSearch  = this.onChangeSearch.bind(this);
    this.submitSearch  = this.submitSearch.bind(this);
  
  

   
  }
  async submitSearch(){
    try{
      
      const citiesRef = collection(db, "reports");
      const q = query(citiesRef, where("report", "==", this.state.searchQuery));
                const querySnapshot = await getDocs(q);
              
              

                querySnapshot.forEach((doc) => {
                  
                 
                  this.setState(
                    { reports: [...this.state.reports, {
                     id: doc.id,
                     data: doc.data(),
                     
           
                    }] }
                  );
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
              
              
             
            });
            console.log(this.state.searchQuery);
            this.setState({searchDone : true}) ;
        
      } catch(e){
        console.log(e) ;
      }

  }

  onChangeSearch (query_){

  this.setState({searchQuery: query_});
 }

  render() {

  return (
    <View style={styles.container2}>
      <SafeAreaView style={styles.container}>
      
   
    
                       
    <FlatList 
              numColumns={1}
              
              data={this.state.reports} 
              renderItem={({ item  }) => ( 
                <View>
                  
                    <Content data={item.data} itemId={item.id} theardCount={item.theardCount} commentsCount={item.commentsCount} navigation={this.props.navigation}/>
                    <Divider />
                
   
            </View>
              )}
            />
            </SafeAreaView>

        
         
           
      
      <BottomNavBar/>
    </View>
  ) 
}
}
export  function TrendingWithProps(props){
  const navigation = useNavigation();

  const route = useRoute();
  const auth = getAuth();
  const users = auth.currentUser;

 




 return(
  <Trending navigation={navigation}  users={users}/>
 )
}
export default Trending
const styles = StyleSheet.create({
  container: {
    height: '90%'
    
  }, container2: {
   flex: 1
    
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

})