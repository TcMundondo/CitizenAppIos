import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TouchableHighlight, Linking, TouchableOpacity, Dimensions } from 'react-native';
import { getAuth } from 'firebase/auth';
import db from '../../firebase';
import { collection, query, where ,getDocs } from "firebase/firestore";
import { Searchbar } from 'react-native-paper';

const { height, width } = Dimensions.get('window');


const AppHeaderWithSearch = () => {
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [image, setImage] = useState('');
  const [userName, setUserName] = useState('');

  const [reports, setReport] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();




  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const uid = user.uid;
        const email = user.email;
        const displayName = user.displayName;
        const photoURL = user.photoURL;
        setUserId(uid);
        setUserEmail(email);
        setImage(photoURL);
        setUserName(displayName);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const onChangeSearch = (query_) => {
    setSearchQuery({query_});

    console.log(query_);
  
  }

  

  const onSubmitSearch  =  async () => {
    onSearch(searchQuery);
         
    try{
      
      const citiesRef = collection(db, "jobs");
      const q = query(citiesRef, where("jobTitle", "==", searchQuery));
                const querySnapshot = await getDocs(q);
              
              

                querySnapshot.forEach((doc) => {
                  
                 
                setReport(
                    { reports: [...reports, {
                     id: doc.id,
                     data: doc.data(),
                     
           
                    }] }
                  );
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data());
              navigation.replace('JobsResults' , {reports: reports}) ;
              
             
            });
           
            //this.setState({searchDone : true}) ;
        
      } catch(e){
        console.log(e) ;
      }

  }

 


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
      value={searchQuery}
      onChangeText={onChangeSearch}
      onSubmitEditing={(event) => onSubmitSearch(event.nativeEvent.text)}
    />
    

      <Image style={styles.tinyLogo} source={require('../../assets/adaptive-icon.png')} />
      
    </View>
  );
};

export default AppHeaderWithSearch;



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
        
 
        
       },
 
 
  
  
 
 
   
   
    
   })




