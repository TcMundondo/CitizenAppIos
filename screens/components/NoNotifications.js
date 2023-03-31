import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Icon from "react-native-feather";

const NoNotifications = () => {

 return (
      <View style={styles.header}>
        <Icon.BellOff  stroke="grey" fill="grey" width={100} height={100}/>
         <Text style={{ padding: 5}}>Oops!..</Text>
         <Text style={{ padding: 5}}>You have no notifications.</Text>
      </View>
   
  )
}
export default NoNotifications

const styles = StyleSheet.create({
  
    header:{
        flex: 1,
      justifyContent: 'center',
       alignItems: 'center',
   },
})