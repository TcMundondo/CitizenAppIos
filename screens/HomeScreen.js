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
import React, { PureComponent } from 'react';
import { StyleSheet, 
          View  , 
          FlatList, 
          SafeAreaView,
          TouchableOpacity,
          Image,
          RefreshControl,
          ActivityIndicator
        } from 'react-native'

import BottomNavBar from './components/bottomNavBar'

import { Header } from 'react-native-elements';
import { Searchbar } from 'react-native-paper';



import { collection, collectionGroup, getDocs , query, where  ,getCountFromServer ,limit  , startAfter , orderBy, startAt
  } from "firebase/firestore";


import { Divider} from 'react-native-paper';
import db from '../firebase';

//import { ActivityIndicator } from 'react-native-paper'
import Content from './components/Content';
import NetworkError from './components/NetworkError';
import { getAuth} from "firebase/auth";

/*********************************************************************************************************************************** */











class HomeScreen extends PureComponent{


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
      refreshing: false,
      loadingMore: false,
      isOpen: false,
      setIsOpen: false,
      fetchedDocs: [], // new state variabl
    };
    this.handLoadMore = this.handLoadMore.bind(this); // binding method to class

    this.onChangeSearch = this.onChangeSearch.bind(this);

    this.onSubmitSearch = this.onSubmitSearch.bind(this);
     this.onRefresh = this.onRefresh.bind(this) ;
  }
 
   
  /*********************************************************************************************************************************** */
  
  componentDidMount() {
    this._fetchData(); //fetch the data when component mounts 
  }



  /*********************************************************************************************************************************** */

  // fetch the report data 
  _fetchData = async () => {
    let timeout = setTimeout(() => {
      if(!this.state.Given){
           this.setState({networkError: true}) ; // display network error  screen .
      }

    }, 5000);
    try{
      // get user profile picture 

      const auth = getAuth();
      const user = auth.currentUser;
      const photoURL = user.photoURL;
      this.setState({image: photoURL}) ;
      



      const reportsRef = collection(db, "reports"); // reference to the reports collection
      const q = query(reportsRef ,  orderBy('createdAt', 'desc'), limit(3)); // query to retrieve the first 5 reports 
      const querySnapshot =  await getDocs(q); // getting the snapshot of the data 
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length-2]; // getting the last visible document 
      console.log("last", lastVisible);
      this.setState({lastVisible: lastVisible }); // setting the state for the last visible document 
      this.setState({Given: true }) ; 
      // saying state is populate 
      querySnapshot.forEach(async (doc) => {
        
        // Check if the doc has already been fetched
        if (!this.state.fetchedDocs.includes(doc.id)) {
          const coll = collectionGroup(db,  'thread') ; // reference to the thread collection group 
          const query_ = query(coll, where('docId', '==', doc.id)); // query to retrieve the threads with matching document id 
          const snapshot = await getCountFromServer(query_); 
          // Add the doc to the fetchedDocs array
          this.setState((prevState) => ({
            fetchedDocs: [...prevState.fetchedDocs, doc.id],
          }));
        
          // Add the new report to the reports array in the component state
          this.setState((prevState) => ({
            reports: [
              ...prevState.reports,
              {
                id: doc.id,
                data: doc.data(),
                theardCount: snapshot.data().count,
                
              },
            ],
          }));
        }
      });
     
    } 
    catch (e) {
      console.log("network error" + e) ; // error handling 
      this.setState({networkError: true}) ; // display network error  screen .


    } 
  }
  

  /*********************************************************************************************************************************** */

  async handLoadMore() {
    try {
      this.setState({ loadingMore: true });
      const reportsRef = collection(db, "reports");
      const q = query(reportsRef,orderBy('createdAt', 'desc'), startAfter(this.state.lastVisible),  limit(2));
      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length- 1];
  
      // Check if the last visible report from the previous query is different from the last visible report from this query
      if (this.state.lastVisible?.id !== lastVisible?.id) {
        this.setState({ lastVisible: lastVisible });
        querySnapshot.forEach(async (doc) => {
          // Check if the doc has already been fetched
          if (!this.state.fetchedDocs.includes(doc.id)) {
            const coll = collectionGroup(db,  'thread') ; // reference to the thread collection group 
            const query_ = query(coll, where('docId', '==', doc.id)); // query to retrieve the threads with matching document id 
            const snapshot = await getCountFromServer(query_); 
            // Add the doc to the fetchedDocs array
            this.setState((prevState) => ({
              fetchedDocs: [...prevState.fetchedDocs, doc.id],
            }));
          
            // Add the new report to the reports array in the component state
            this.setState((prevState) => ({
              reports: [
                ...prevState.reports,
                {
                  id: doc.id,
                  data: doc.data(),
                  theardCount: snapshot.data().count,
                  
                },
              ],
            }));
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
  


  /*********************************************************************************************************************************** */


/*********************************************************************************************************************************** */
 onChangeSearch(query_) {
  const {navigation} = this.props ;
  navigation.navigate('HomeSearch') ;
  this.setState({searchQuery: query_});

  console.log(query_);

}
/*********************************************************************************************************************************** */


async  onSubmitSearch() {

this.setState({ jobs: [] }) ;
        
       
  try{
    const {navigation} = this.props ;
    const citiesRef = collection(db, "reports");
    const q = query(citiesRef, where("UserName", "==", this.state.searchQuery) , where("category", "==", this.state.searchQuery) , where("report", "==", this.state.searchQuery));
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
onRefresh = () => {
  this.setState({ refreshing: true });
  
  this._fetchData(); //fetch the data when component mounts 
}
/*********************************************************************************************************************************** */
render() {
  const {networkError , image , searchQuery , loadingMore} = this.state ;  

const {navigation} = this.props ;
  return (
    
    <View style={styles.container2}>
      
       <Header   containerStyle={{
    backgroundColor: 'white',
    justifyContent: 'space-around',

  }}
 leftComponent={
    <TouchableOpacity style={{marginLeft: 5}} onPress={() => navigation.replace('Profile')}>
      {image ? (
        <Image source={{ uri: image }} style={styles.photo} />
      ) : (
        <Image source={require('../assets/citizen1.png')} style={styles.photo} />
      )}
    </TouchableOpacity>
  }

  centerComponent={
    <Searchbar
     onPressIn={() => {
      navigation.navigate('HomeSearch') ;}}
      style={styles.searchbar}
      placeholderStyle={styles.placeholderText}
      iconColor="#F7A10D" // set icon color to #F7A10D
      placeholderTextColor="#F7A10D"
      placeholder="Search"
      value={searchQuery}
      onChangeText={this.onChangeSearch}
      onSubmitEditing={this.onSubmitSearch}
    />
  }
 
 
  
  rightComponent={
    <Image style={styles.tinyLogo} source={require('../assets/adaptive-icon.png')} />
  }

  
/>
        

      {networkError?<NetworkError navigation={navigation}/>:        
       <SafeAreaView style={styles.container}>
         {this.state.reports.length === 0? <ActivityIndicator animating={true} size={'large'} /> : null }
              <FlatList 
            
              numColumns={1}

              
              data={this.state.reports} 
              onEndReached = { this.handLoadMore }
              onEndReachedThreshold = { 0 }

              keyExtractor={item => item.id}
              renderItem={({ item  }) => ( 
                <View> 
                <Content data={item.data} itemId={item.id} theardCount={item.theardCount} commentsCount={item.commentsCount} navigation={navigation}/>

                <Divider />
                </View>
              )}
              extraData={item => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
              ListFooterComponent={
                loadingMore ? (
                  <ActivityIndicator size={'large'} color={'gray'} />
                ) : null
              }
            /> 
      </SafeAreaView>}
      
        <BottomNavBar/>   
    </View>
    
  )
 }

}






  /*********************************************************************************************************************************** */


export  function  HomeWithProps(props){
  const navigation = useNavigation();
  const route = useRoute();
 





 return(
  <HomeScreen navigation={navigation} route={route} />
 )
}


  /*********************************************************************************************************************************** */

export default React.memo(HomeWithProps);




  /*********************************************************************************************************************************** */

const styles = StyleSheet.create({
  container: {
    height:'80%',
    backgroundColor:"white"
    
  }, container2: {
   flex: 1,
   backgroundColor:"white"
    
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