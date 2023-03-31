import { useNavigation , useRoute } from '@react-navigation/core'
import React, { PureComponent } from 'react';
import { StyleSheet, View  , FlatList, SafeAreaView, } from 'react-native'
import BottomNavBar from './components/bottomNavBar'
import { collection, collectionGroup, getDocs ,addDoc, query, where } from "firebase/firestore";
import { Avatar, Button, Card, Title, Paragraph , Text} from 'react-native-paper';
import { Divider} from 'react-native-paper';
import { IconButton, MD3Colors } from 'react-native-paper';
import { Dialog, Portal} from 'react-native-paper';
import { ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import db from '../firebase';
import { getStorage, ref, uploadBytes ,getDownloadURL } from "firebase/storage";
import Content from './components/Content';
import CommunitiesCom from './components/CommunitiesCom';

class Communities extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
      visible: false,
      currentItems: {},
      value:"",
      docId: null,
      thread: null,
      threadValue: ""
   
    };
     this.handleChange = this.handleChange.bind(this);
    this.handleChangeThread= this.handleChangeThread.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
    this.currentItem = this.currentItem.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitThread = this.handleSubmitThread.bind(this);
  
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
      const reportsRef = collection(db, "reports"); // reference to the reports collection
      const q = query(reportsRef ,  limit(5)); // query to retrieve the first 5 reports 
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
 
hideDialog(){
  this.setState({visible: false});
}
handleChange(value) {
  this.setState({value: value});
  
}
handleChangeThread(threadValue) {
  this.setState({threadValue: threadValue});
  
}
async currentItem(item , id , thread){
  await this.setState({currentItems: item});
  await this.setState({docId: id}) ;
  await this.setState({thread: thread}) ;
  console.log(this.state.currentItems) ;
  this.setState({visible: true});
}

async handleSubmit(event) {
  try {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
    const docRef = await addDoc(collection(db, "reports" ,this.props.docId ,"comments" ), {
      comment: this.state.value,
      docId: this.state.docId ,

  
    
     
    });
   
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
 
}
async handleSubmitThread(event) {
  try {
    alert('A name was submitted: ' + this.state.threadValue);
    event.preventDefault();
    const docRef = await addDoc(collection(db, "reports" ,this.props.docId ,"thread" ), {
      thread: this.state.threadValue,
      docId: this.props.docId,
    
  
    
     
    });
   
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
 
}








  

  render() {
    const {navigation} = this.props ;
    const {reports} = this.state ;

  return (
    <View style={{flex: 1 , backgroundColor:'white'}}>
         <SafeAreaView style={{height: "90%"}}>
         <ScrollView >
           <CommunitiesCom navigation={navigation}/>
           
              {/*  <Content data={item.data} itemId={item.id} theardCount={item.theardCount}  navigation={navigation}/>*/}
        </ScrollView>
           </SafeAreaView>

   <BottomNavBar/>   
 
 </View>
    
  )
 }




}
export  function CommunitiesWithProps(props){
  const navigation = useNavigation();

  const route = useRoute();
  //const { itemId, report,theardCount,commentsCount } = route.params;






 return(
  <Communities navigation={navigation} route={route}  />
 )
}

export default Communities

const styles = StyleSheet.create({
   container2: {
   flex: 1
    
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

})