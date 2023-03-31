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
          ActivityIndicator,
          RefreshControl
        } from 'react-native'
import BottomNavBar from './components/bottomNavBar'
import { collection, collectionGroup, getDocs , query, where  ,getCountFromServer ,limit  , startAt 
  } from "firebase/firestore";
import { Divider} from 'react-native-paper';
import db from '../firebase';
import Content from './components/Content';
import NetworkError from './components/NetworkError';
/*********************************************************************************************************************************** */











class CommunityScreen extends PureComponent{


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
      refreshing: false,
      loadingMore: false,
      fetchedDocs: [], 
    };
    this.handLoadMore = this.handLoadMore.bind(this); // binding method to class
  }
 
   
  /*********************************************************************************************************************************** */
  
  componentDidMount() {
    this._fetchData(); //fetch the data when component mounts 
  }



/*********************************************************************************************************************************** */
onRefresh = () => {
  this.setState({ refreshing: true });
  
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
      const {category} = this.props ;
      const reportsRef = collection(db, "reports"); // reference to the reports collection
      const q = query(reportsRef , where("category", "==", category), limit(5)); // query to retrieve the first 5 reports 
      const querySnapshot =  await getDocs(q); // getting the snapshot of the data 
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1]; // getting the last visible document 
      console.log("last", lastVisible);
      this.setState({lastVisible: lastVisible }); // setting the state for the last visible document 
      this.setState({Given: true }) ; // saying state is populate 
      querySnapshot.forEach( async (doc) => {
        const coll = collectionGroup(db,  'thread') ; // reference to the thread collection group 
        const query_ = query(coll, where('docId', '==', doc.id)); // query to retrieve the threads with matching document id 
        const snapshot = await getCountFromServer(query_); // getting the count of the threads 
        
        const col = collectionGroup(db,  'comments') ; // reference to the comments collection group 
        const _query = query(col, where('docId', '==', doc.id)); // query to retrieve the comments with matching document id 
        const snapshotComment = await getCountFromServer(_query); // getting the count of the comments 
        
        this.setState(
          { reports: [...this.state.reports, {
           id: doc.id, // id of the document 
           data: doc.data(), // data of the report 
           theardCount:snapshot.data().count, // count of the threads 
           commentsCount:snapshotComment.data().count, // count of the comments 
          }] }
        );
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
      // Fetch more reports from the database, starting from the last visible report from the previous query
      
      this.setState({ loadingMore: true }); 
      const {category} = this.props ;
      const reportsRef = collection(db, "reports");
      const q = query(reportsRef , where("category", "==", category), startAt(this.state.lastVisible) , limit(1));
      const querySnapshot =  await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
  
      // Check if the last visible report from the previous query is different from the last visible report from this query
      // to avoid duplicates in the reports array
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

  render() {
  const {networkError, loadingMore} = this.state ;  
  const {navigation} = this.props ;
  return (
    
    <View style={styles.container2}>
        

      {networkError?<NetworkError navigation={navigation}/>:        
       <SafeAreaView style={styles.container}>
         {this.state.reports.length === 0? <ActivityIndicator animating={true} size={'large'} /> : null }
              <FlatList 
              numColumns={1}
              
              data={this.state.reports} 
              onEndReached = { this.handLoadMore }
              onEndReachedThreshold = { 0 }
              renderItem={({ item  }) => ( 
                <View> 
                <Content data={item.data} itemId={item.id} theardCount={item.theardCount} commentsCount={item.commentsCount} navigation={navigation}/>

                <Divider />
                </View>
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
      </SafeAreaView>}

        <BottomNavBar/>   
    </View>
    
  )
 }

}






  /*********************************************************************************************************************************** */


export  function  CommunityScreenWithProps(props){
  const navigation = useNavigation();
  const route = useRoute();

  const { category } = route.params;
 





 return(
  <CommunityScreen navigation={navigation} route={route} category={category}/>
 )
}


  /*********************************************************************************************************************************** */

export default React.memo(CommunityScreenWithProps);




  /*********************************************************************************************************************************** */

const styles = StyleSheet.create({
  container: {
    height: '90%',
    
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