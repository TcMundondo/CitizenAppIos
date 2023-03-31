import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TouchableHighlight, Linking, TouchableOpacity, Dimensions } from 'react-native';
import { getAuth } from 'firebase/auth';

const { height, width } = Dimensions.get('window');

const AppHeaderLogo = () => {
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [image, setImage] = useState('');
  const [userName, setUserName] = useState('');

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

  return (
    <View style={styles.appbar}>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        {image ? (
          <Image source={{ uri: image }} style={styles.photo} />
        ) : (
          <Image source={require('../../assets/citizen1.png')} style={styles.photo} />
        )}
      </TouchableOpacity>
      <Text style={{fontWeight:'bold' , fontSize: 20 ,color: "#F7A10D" }}>Notifications</Text>
      <Image style={styles.tinyLogo} source={require('../../assets/adaptive-icon.png')} />
     
    </View>
  );
};

export default AppHeaderLogo;






const styles = StyleSheet.create({
   appbar:{

    width:'100%' , 
    flexDirection: 'row',
     justifyContent: 'space-between',
    backgroundColor: 'white',
    right:15,
   
    paddingHorizontal:10,

    alignItems: 'stretch',
    alignItems:"center",
    marginBottom:10,
    marginTop:5
   
  
     
    
   
 
   },
  
    tinyLogo: {
   
      justifyContent: 'center',
      alignItems: 'center',
      width: 40,
      height: 40,
     
    
      paddingBottom:10
      
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
        width: 40,
        height: 40,
        borderRadius: 50,
        marginTop:2

       
      },


 
 


  
  
   
  })