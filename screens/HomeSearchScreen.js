/**
 * comments from chart gpt
 * The code is a React Native component for the home screen of an app that 
 * displays a list of reports. The component uses the React Navigation and 
 * Firebase libraries to fetch and display reports data. 
 * The component uses FlatList component to display the reports in a scrollable list format. 
 * The report data is fetched from the Firestore database and the number of threads and
 *  comments are also displayed for each report. 
 * The component also has a function to handle the loading of more reports
 *  when the end of the list is reached. The component makes use of several UI components 
 * from the React Native Paper library, such as Avatar, Button, and TextInput.
 */



/*********************************************************************************************************************************** */
import { useNavigation , useRoute } from '@react-navigation/core'
import React, { Component } from "react";
import { StyleSheet, 
          View  , 
          FlatList, 
          SafeAreaView,Text,
          TouchableOpacity,
          Image
        } from 'react-native'

import BottomNavBar from './components/bottomNavBar'

import { Header } from 'react-native-elements';
import { Searchbar } from 'react-native-paper';



import { collection, collectionGroup, getDocs , query, where  ,getCountFromServer ,limit  , startAt 
  } from "firebase/firestore";


import { Divider} from 'react-native-paper';
import db from '../firebase';

import { ActivityIndicator } from 'react-native-paper'
import Content from './components/Content';
import NetworkError from './components/NetworkError';
import { getAuth} from "firebase/auth";
/*********************************************************************************************************************************** */











class HomeSearchScreen extends Component{


  /*********************************************************************************************************************************** */

  constructor(props) {
    super(props);
    this.state = {
      reports: [], // array to store the reports 
      visible: false, // visibility of modal 
      currentItems: {}, // current report data 
      value:"", // value of the comment 
      docId: null, // document id 
      thread: null, // thread object 
      threadValue: "", // value of the thread 
      lastVisible:"", // last visible document 
      touched: "", tweet: "",  likes: "",
      name: "", handle: "", time: "" , liked:false, photo: "" ,// report data
      networkError: false,
      Given: false ,
      searchQuery: '',
      image:'',
      searched: false
    };
    this.inputRef = React.createRef(); 
    this.handLoadMore = this.handLoadMore.bind(this); // binding method to class

    this.onChangeSearch = this.onChangeSearch.bind(this);

    this.onSubmitSearch = this.onSubmitSearch.bind(this);
  }
 
   /**************************************************************************************************************************************** */
   componentDidMount(){
    
    this.inputRef.current.focus();

   }
 




   /**************************************************************************************************************************************** */
  // this method is called when the user scrolls to the end of the list
  async handLoadMore(){
    try {
      // Fetch more reports from the database, starting from the last visible report from the previous query
      const reportsRef = collection(db, "reports");
      const q = query(reportsRef , startAt(this.state.lastVisible) , limit(2));
      const querySnapshot =  await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
  
      // Check if the last visible report from the previous query is different from the last visible report from this query
      // to avoid duplicates in the reports array
      if(this.state.lastVisible !==  lastVisible){
        this.setState({lastVisible: lastVisible });
  
        // Loop through each document in the query snapshot and update the reports array in the component state
        querySnapshot.forEach( async (doc) => {
          const coll = collectionGroup(db,  'thread') ;
          const query_ = query(coll, where('docId', '==', doc.id));
          const snapshot = await getCountFromServer(query_);
  
          const col = collectionGroup(db,  'comments') ;
          const _query = query(col, where('docId', '==', doc.id));
          const snapshotComment = await getCountFromServer(_query);
  
          // Add the new report to the reports array in the component state
          this.setState(
            { reports: [...this.state.reports, {
              id: doc.id,
              data: doc.data(),
              theardCount:snapshot.data().count,
              commentsCount:snapshotComment.data().count,
            }] }
          );

       // this.setState({ networkError: false}) ; // remove network error massege 
        });
      }
    } catch (e) {
      console.log(e);

    }
  }
  


  /*********************************************************************************************************************************** */


/*********************************************************************************************************************************** */
 onChangeSearch(query_) {
  this.setState({searchQuery: query_});

  console.log(query_);

}
/*********************************************************************************************************************************** */


async  onSubmitSearch() {

this.setState({ jobs: [] }) ;
this.setState({ searched: true}) ;
        
       
  try{
    const {navigation} = this.props ;
    const citiesRef = collection(db, "reports");
    const q = query(citiesRef,  where("hashtags", 'array-contains', this.state.searchQuery));
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
           // navigation.replace('JobsResults' , {reports: reports}) ;
            
           
          });
         
          //this.setState({searchDone : true}) ;
      
    } catch(e){
      console.log(e) ;
    }

}

/*********************************************************************************************************************************** */
handleSearch(query_) {
console.log('Search query:', query_);
// Do something with the search query, e.g. fetch search results from an API
}

/*********************************************************************************************************************************** */

  render() {
  const {networkError , image , reports , searched , searchQuery} = this.state ;  

const {navigation} = this.props ;
  return (
    
    <View style={styles.container2}>
      
       <Header   containerStyle={{
    backgroundColor: 'white',



  }}
 leftComponent={
  <View style={styles.headerCenter}>
  <Searchbar
    ref={this.inputRef}
    style={styles.searchbar}
    placeholderStyle={styles.placeholderText}
    placeholder="search for #tags"
    iconColor="#F7A10D" // set icon color to #F7A10D
    placeholderTextColor="#F7A10D"
    value={searchQuery}
    onChangeText={this.onChangeSearch}
    onSubmitEditing={this.onSubmitSearch}
  />
   
</View>

    
  }
 
 
  
  
  leftContainerStyle={{ flex: 135 }}

/>
  

      {networkError?<NetworkError navigation={navigation}/>:        
       <SafeAreaView style={styles.container}>
         {reports.length === 0 && searched? <ActivityIndicator animating={true} size={'large'} /> : null }
              <FlatList 
              numColumns={1}
              
              data={reports} 
              onEndReached = { this.handLoadMore }
              onEndReachedThreshold = { 0 }
              renderItem={({ item  }) => ( 
                <View> 
                <Content data={item.data} itemId={item.id} theardCount={item.theardCount} commentsCount={item.commentsCount} navigation={navigation}/>

                <Divider />
                </View>
              )}
            /> 
      </SafeAreaView>}
      

        <BottomNavBar/>   
    </View>
    
  )
 }

}






/*********************************************************************************************************************************** */


export  function HomeSearchScreenWithProps(props){
  const navigation = useNavigation();
  const route = useRoute();
 





 return(
  <HomeSearchScreen navigation={navigation} route={route} />
 )
}


  /*********************************************************************************************************************************** */






  /*********************************************************************************************************************************** */

const styles = StyleSheet.create({
  container: {
    
    backgroundColor:"white"
    
  }, container2: {
   flex: 1,
   backgroundColor:"white"
    
  },
  
  searchbar:{
    flex: 1,
    width: '100%',
     

  },
  headerCenter: {
    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    
  },

  placeholderText: {
     fontSize: 10, 
   },
  
  tinyLogo2: {
 
   
    alignItems: 'center',
    width: 40,
    height: 40,
  
  
    
  
    paddingBottom:10
    
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
  tinyLogo: {
    
    justifyContent: 'center',
    alignItems: 'center',
    width: 53,
    height: 53,
    borderRadius: 50,
   
 
    
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
 
  info: {
    flex: 0.77,
    borderColor: "yellow",
    flexDirection: "column",
    borderWidth: 0
  },
  
  searchbar:{
    width:'100%' ,
     borderColor: '#F7A10D',
     borderWidth: 1, // add
     placeholderTextColor: '#F7A10D', 
     

  },
  placeholderText: {
     fontSize: 10, 
   },
  
  tinyLogo2: {
 
   
    alignItems: 'center',
    width: 40,
    height: 40,
  
  
    
  
    paddingBottom:10
    
  },
  appCommentHeader:{
      flexDirection: "row",
      alignItems: 'center',
      justifyContent:"space-between"
     
    },
    Text:{
      fontWeight: "bold" ,
    },
    TextBy:{
      fontWeight: "bold" ,
      fontSize:5,
      
    
      left:100
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
      right:10
     

     
    },


})