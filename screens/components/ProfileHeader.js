import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TouchableHighlight, Linking, TouchableOpacity, Dimensions } from 'react-native';
import { getAuth } from 'firebase/auth';
import { Portal ,Modal} from 'react-native-paper';

import AntDesign from 'react-native-vector-icons/AntDesign';

const { height, width } = Dimensions.get('window');

const ProfileHeader = () => {

  const navigation = useNavigation();

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  // Handle the cancel button press
  const containerStyle = {backgroundColor: 'white', padding: 20};
  const handleCancelPress = () => {
  navigation.navigate('EditedProfile') ;
 };

  return (
    <View style={styles.header}>

    <Text style={styles.headerText}> Profile </Text>
    <TouchableOpacity  onPress={showModal}>

        <AntDesign  style={styles.edit} name={'setting'} size={25}  color={'rgb(136, 153, 166)'}/>
        
     </TouchableOpacity>
     <Provider>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Text>Example Modal.  Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>
      <Button style={{marginTop: 30}} onPress={showModal}>
        Show
      </Button>
    </Provider>

      
     </View>
     
  );
};

export default ProfileHeader;






const styles = StyleSheet.create({      
    header:{
            flex: 1,
            flexDirection:"row",
            justifyContent:'space-between'
    },
    edit: {
        fontFamily: 'Helvetica Neue',
        fontSize: 18,
        fontWeight: '400',
        lineHeight: 21,
        letterSpacing: 0,
        alignItems:'center',
        marginRight: 80,
        alignSelf:'flex-end',
        

      },
      headerText:{
        alignItems:"center",
        alignSelf:'center',
        alignItems:'center',
        marginLeft:85,
        fontSize:22,
        fontWeight:'700'
        

      }
  
    })