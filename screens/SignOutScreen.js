import { useNavigation , useRoute } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { getAuth, signOut } from "firebase/auth";
import BottomNavBar from './components/bottomNavBar'


const SignOutScreen = () => {
  const navigation = useNavigation()

  const handleSignOut = () => {
             const auth = getAuth();
        signOut(auth).then(() => {
          navigation.replace("PhoneVerification")
        }).catch((error) => {
          // An error happened.
        });
       console.log('Pressed add')
  }

  return (
    <View  style={styles.container2}>
      <View style={styles.container}>
      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
      
      </View>
      <BottomNavBar/> 
    </View>
  )
}
export  function SignOutWithProps(props){
  const navigation = useNavigation();
  const route = useRoute();


  



 return(
  <SignOutScreen navigation={navigation} route={route} />
 )
}

export default SignOutScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
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
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
})