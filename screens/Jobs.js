import { useNavigation , useRoute } from '@react-navigation/core'
import React, { PureComponent } from 'react';
import { StyleSheet, View  , FlatList, SafeAreaView,TouchableHighlight,TouchableOpacity, Image ,ActivityIndicator,
  RefreshControl} from 'react-native'
import BottomNavBar from './components/bottomNavBar'
import { collection, collectionGroup, getDocs , query, where  ,getCountFromServer ,limit  , startAt } from "firebase/firestore";
import { Divider} from 'react-native-paper';
import db from '../firebase';
//import { ActivityIndicator } from 'react-native-paper'
import JobApply from './components/JobApply';
import NetworkError from './components/NetworkError';
import NoJobs from './components/NoJobs';
import { Header } from 'react-native-elements';
import { Searchbar } from 'react-native-paper';
import { getAuth} from "firebase/auth";

//import AppHeaderWithSearch from './components/AppHeaderWithSearch';
/*********************************************************************************************************************************** */

class Jobs extends PureComponent{



  constructor(props) {
    super(props);
    this.state = {
      jobs: [], // array to store the jobs 
      currentItems: {}, // current report data 
      value:"", // value of the comment 
      docId: null, // document id 
      lastVisible:"", // last visible document 
      networkError: false,
      Given: false ,
      searchQuery: '',
      image:'',
      refreshing: false,
      loadingMore: false


    
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
      const auth = getAuth();
      const user = auth.currentUser;
      const photoURL = user.photoURL;
      this.setState({image: photoURL}) ;
     
      const jobsRef = collection(db, "jobs"); // reference to the jobs collection
      const q = query(jobsRef); // query to retrieve the first 5 jobs 
      const querySnapshot =  await getDocs(q); // getting the snapshot of the data 
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1]; // getting the last visible document 
      console.log("last", lastVisible);
      this.setState({lastVisible: lastVisible }); // setting the state for the last visible document
      this.setState({Given: true }) ; // saying state is populate 

  
      querySnapshot.forEach( async (doc) => {
  
        this.setState(
          { jobs: [...this.state.jobs, {
           id: doc.id, // id of the document 
           data: doc.data(), // data of the report 
         
          }] }
        );
        this.setState({ refreshing: false });
        this.setState({ networkError: false}) ; // remove network error massege 
        console.log(doc.id, " => ", doc.data()); // logging the document id and data 
        });
    } 
    catch (e) {
      console.log("network error" + e) ; // error handling 
      this.setState({networkError: true}) ; // display network error  screen .
    } 
  }
  

  /*********************************************************************************************************************************** */

  // this method is called when the user scrolls to the end of the list
  async handLoadMore(){
    try {
      this.setState({loadingMore: true}) ; 
      // Fetch more jobs from the database, starting from the last visible report from the previous query
      const jobsRef = collection(db, "jobs");
      const q = query(jobsRef , startAt(this.state.lastVisible) , limit(5));
      const querySnapshot =  await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
  
      // Check if the last visible report from the previous query is different from the last visible report from this query
      // to avoid duplicates in the jobs array
      if(this.state.lastVisible !==  lastVisible){
        this.setState({lastVisible: lastVisible });
  
        // Loop through each document in the query snapshot and update the jobs array in the component state
        querySnapshot.forEach( async (doc) => {
          
          this.setState(
            { jobs: [...this.state.jobs, {
              id: doc.id,
              data: doc.data(),
            }] }
          );
        });
      }
    } catch (e) {
      console.log(e);
    }
  } 
  


/*********************************************************************************************************************************** */
 onChangeSearch(query_) {
    this.setState({searchQuery: query_});

    console.log(query_);
  
  }
/*********************************************************************************************************************************** */
  

 async  onSubmitSearch() {

  this.setState({ jobs: [] }) ;
          
         
    try{
      const {navigation} = this.props ;
      const citiesRef = collection(db, "jobs");
      const q = query(citiesRef, where("jobTitle", "==", this.state.searchQuery));
                const querySnapshot = await getDocs(q);
              
              

                querySnapshot.forEach((doc) => {
                  
                 
                this.setState(
                    { jobs: [...this.state.jobs, {
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

/*********************************************************************************************************************************** */
onRefresh = () => {
  this.setState({ refreshing: true });
  
  this._fetchData(); //fetch the data when component mounts 
}
/*********************************************************************************************************************************** */
  render() {
    
 const { navigation } = this.props ;
 const {jobs ,image, networkError , searchQuery , loadingMore} = this.state ;

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
    </SafeAreaView>
       }

        <BottomNavBar/>   
    </View>
    
  )
 }

}






  /*********************************************************************************************************************************** */


export  function  JobsWithProps(props){
  const navigation = useNavigation();
  const route = useRoute();
 
  //const { jobs} = route.params;





 return(
  <Jobs navigation={navigation} route={route} />
 )
}


  /*********************************************************************************************************************************** */

//export default React.memo(JobsWithProps);




  /*********************************************************************************************************************************** */

const styles = StyleSheet.create({
  container: {
    height:'80%',
   
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
  },
  tinyLogo: {
    
    justifyContent: 'center',
    alignItems: 'center',
    width: 53,
    height: 53,
    borderRadius: 50,
   
 
    
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