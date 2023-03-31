import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TouchableHighlight, Linking, TouchableOpacity, Dimensions } from 'react-native';
import { getAuth } from 'firebase/auth';
import db from '../../firebase';
import { collection, query, where ,getDocs } from "firebase/firestore";
import { Searchbar } from 'react-native-paper';

const { height, width } = Dimensions.get('window');




class SearhHeader extends React.Component  {

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
    const {navigation , image} = this.props ;

  return (
    <View style={styles.appbar}>
      <TouchableOpacity onPress={() => navigation.replace('Profile')}>
        {image ? (
          <Image source={{ uri: image }} style={styles.photo} />
        ) : (
          <Image source={require('../../assets/citizen1.png')} style={styles.photo} />
        )}
      </TouchableOpacity>
      
        
    <Searchbar
      style={styles.searchbar}
      placeholderStyle={styles.placeholderText} 
      iconColor="#F7A10D" // set icon color to #F7A10D
      placeholderTextColor="#F7A10D"
      placeholder="Search"
      value={this.state.searchQuery}
      onChangeText={this.onChangeSearch}
      onSubmitEditing={this.submitSearch}
    />
    

      <Image style={styles.tinyLogo} source={require('../../assets/adaptive-icon.png')} />
      
    </View>

  ) 
}
}
export  function SearhHeaderWithProps(props){
  const navigation = useNavigation();

 // const route = useRoute();
  const auth = getAuth();
  const user = auth.currentUser;
  const image = user.photoURL;

 




 return(
  <SearhHeader navigation={navigation}  users={user} image={image}/>
 )
}
//export default SearhHeader
const styles = StyleSheet.create({
    appbar:{

        flexDirection: 'row',      
        justifyContent: 'space-between',
        backgroundColor: 'white',
        },
      
        tinyLogo: {
       
          justifyContent: 'center',
          alignItems: 'center',
          width: 53,
          height: 53,
          borderRadius: 50,
         
       
          
        },
        searchbar:{
           width:'70%',
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
           
    
          }   
})