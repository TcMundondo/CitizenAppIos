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
import Threads from './components/Threads'
import Content from './components/Content';
import Article from './components/Article'







class ThreadScreen extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      threads: [],
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
async componentDidMount() {
    try{
   
    // const theads = this.props.docId;
 // const { itemId, otherParam } = route.params;
 const threads =  await query(collectionGroup(db,  'thread'), where('docId', '==', this.props.docId));
 const querySnapshot = await getDocs(threads);
 querySnapshot.forEach((doc) => {
  this.setState(
    { threads: [...this.state.threads, {
     id: doc.id,
     data: doc.data()
    }] }
  );
// doc.data() is never undefined for query doc snapshots
console.log(this.state.threads);



});
     
  
} 
   

  catch (e) {
    console.log(e) ;

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
    const {navigation , report} = this.props ;

  return (
    <View style={styles.container2}>
         <SafeAreaView style={styles.container}>
       
           
        
              <FlatList 
              numColumns={1}
              
              data={this.state.threads} 
              ListHeaderComponent={()=>  <Article data={this.props.report} itemId={this.props.docId} theardCount={this.props.theardCount} commentsCount={this.props.commentsCount} navigation={this.props.navigation}/>}
              renderItem={({ item  }) => ( 
                <View>
                  
                 <Divider />
                 <Threads data={item.data} navigation={navigation} category={report.category} />
              
                 
                <Divider />
   
            </View>)}/>
             
   </SafeAreaView>
 
 </View>
    
  )
 }




}
export  function ThreadWithProps(props){
  const navigation = useNavigation();

  const route = useRoute();
  const { itemId, report,theardCount,commentsCount } = route.params;






 return(
  <ThreadScreen navigation={navigation} route={route} docId={itemId} report={report} theardCount={theardCount} commentsCount={commentsCount} />
 )
}

export default ThreadScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white' ,
    
  }, container2: {
   flex: 1 ,
   backgroundColor: 'white' ,
    
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