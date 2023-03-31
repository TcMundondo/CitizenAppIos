import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TouchableHighlight, Linking, TouchableOpacity, Dimensions } from 'react-native';
import { getAuth } from 'firebase/auth';

const { height, width } = Dimensions.get('window');


const CommunitiesHeader = () => {
  const [image, setImage] = useState('');
  const navigation = useNavigation();




  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const photoURL = user.photoURL;

        setImage(photoURL);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

return (
    <View style={styles.appbar}>
      <TouchableOpacity onPress={() => navigation.replace('Profile')}>
        {image ? (
          <Image source={{ uri: image }} style={styles.photo} />
        ) : (
          <Image source={require('../../assets/citizen1.png')} style={styles.photo} />
        )}

      </TouchableOpacity>
      
      <TouchableOpacity>
       <Text style={{color: "#F7A10D" , alignSelf: "baseline" ,fontWeight:'bold', fontSize: 20}}>Communities</Text> 
      </TouchableOpacity>
       <TouchableOpacity>
      <Image style={styles.tinyLogo} source={require('../../assets/adaptive-icon.png')}/>

      </TouchableOpacity>
      
    </View>
  );
};

export default CommunitiesHeader;



const styles = StyleSheet.create({
appbar:{
  flex: 1 ,
     flexDirection: 'row',      
     justifyContent: 'space-between',
     backgroundColor: 'white',
     alignItems: "center",
     height: 50 ,
     marginBottom:15
     },
   
     tinyLogo: {
       width: 53,
       height: 53,
       borderRadius: 50,
       marginRight: 10
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
         width: 45,
         height: 45,
         borderRadius: 50,
         right:10
        
 
        
       },
 
 
  
  
 
 
   
   
    
   })
