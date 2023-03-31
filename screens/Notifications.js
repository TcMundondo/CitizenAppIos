import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import BottomNavBar from './components/bottomNavBar'
import NoNotifications from './components/NoNotifications'

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';



const Notifications = () => {

  return (
    <View style={styles.container}>

     <NoNotifications/> 
     
    <BottomNavBar/>
    </View>
  )
}
export default Notifications

const styles = StyleSheet.create({
  container: {
    flex: 1,
    

    
    backgroundColor:"white"
    },
    header:{
      justifyContent: 'center',
       alignItems: 'center',
       marginTop:50
   },
})