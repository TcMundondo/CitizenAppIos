/*********************************************************************************************************************************** */
import { useNavigation , useRoute } from '@react-navigation/core'
import React, { PureComponent } from 'react';
import { StyleSheet, 
          View  , 
          Text, 
          SafeAreaView,
          TouchableOpacity,
          TouchableHighlight
        } from 'react-native'

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import * as Icon from "react-native-feather";




  /*********************************************************************************************************************************** */











class NetworkError extends PureComponent{


  /*********************************************************************************************************************************** */

  constructor(props) {
    super(props);
    this.state = {
    
    };
  }
 
   
   
  /*********************************************************************************************************************************** */
  
  


  /*********************************************************************************************************************************** */
  render() {
 const { navigation } = this.props ;
 const {jobs} = this.state ;

  return (
         <SafeAreaView style={styles.container}>
         <View style={styles.box}>
          <View style={{justifyContent: 'center',alignItems: 'center',}}>

            <Icon.WifiOff  stroke="grey" fill="grey" width={100} height={100}/>
          </View>
         <Text style={{fontWeight: "bold" ,textDecorationLine: 'underline' , textAlign: 'center' , paddingTop: 10 }} >No internet connection</Text>
         <Text>Check your connection first,then refresh the page after.</Text>
         <View style={{justifyContent: 'center',alignItems: 'center',}}>
         <TouchableOpacity onPress={() => {navigation.replace("Home");}} style={styles.button}>
                      <Text style={styles.buttonText}>Refresh</Text>
                </TouchableOpacity>
        </View>      

         </View>
              
      </SafeAreaView>
       
    
  )
 }

}










  /*********************************************************************************************************************************** */

export default NetworkError ;




  /*********************************************************************************************************************************** */

const styles = StyleSheet.create({
  container: {
    flex: 1 ,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white"
    
  },
  box:{
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#F7A10D',
    width: '40%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10 ,
    textAlign: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  
  bgColor: {
    backgroundColor:'white',
    borderRadius: 10,
  },

})
/*********************************************************************************************************************************** */

