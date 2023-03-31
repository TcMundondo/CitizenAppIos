import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Icon from "react-native-feather";

const AboutApp = () => {

 return (
      <View style={styles.header}>
       <Icon.ShieldOff  stroke="grey" fill="grey" width={100} height={100}/>
         <Text style={{ padding: 5}}>Oops!..</Text>
          <Text style={{ padding: 5}}>They are no new job postings.</Text>
      </View>
   
  )
}
export default AboutApp

const styles = StyleSheet.create({
   header:{
        flex: 1,
      justifyContent: 'center',
       alignItems: 'center',
   },
})