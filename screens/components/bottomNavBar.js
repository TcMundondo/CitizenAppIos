// navigate to different screen
import React, { useState } from 'react';

import { StyleSheet , Pressable ,View} from 'react-native';
import { Appbar, FAB, useTheme ,IconButton} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core'
import { Portal } from 'react-native-paper';
import { getAuth, signOut } from "firebase/auth";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Icon from 'react-native-vector-icons/Entypo';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const BOTTOM_APPBAR_HEIGHT = 50;
const MEDIUM_FAB_HEIGHT = 56;

const BottomNavBar = () => {
  const { bottom } = useSafeAreaInsets();
  const theme = useTheme();
  const navigation = useNavigation();
  const [state, setState] = useState({ open: false });
  const [home, setHome] = useState(false);
  const [search, setSearch] = useState(false);
  const [notification, setNotification] = useState(false);
  const [jobs, setJobs] = useState(false);
  const [post, setPost] = useState(false);

  const onStateChange = ({ open }) => setState({ open });
  const auth = getAuth();

  const handleSignOut = () => {
    console.log('Pressed add')
  }

  const { open } = state;

  return (
    <PaperProvider>
      <Appbar
        style={[
          styles.bottom,
          {
            height: BOTTOM_APPBAR_HEIGHT + bottom,
          },
        ]}
        safeAreaInsets={{ bottom }}
      >
        <MaterialIcons
          name="home-filled"
          size={25}
          onPress={() => {
            console.log('Clicked home icon');

            setHome(true);
            setSearch(false);
            setNotification(false);
            setJobs(false);
            setPost(false);
            navigation.replace('Home');
          }}
        />
        

        <MaterialIcons

          name="group"
          size={27}
          onPress={() => {
            console.log('Clicked search icon');

            setHome(false);
            setSearch(true);
            setNotification(false);
            setJobs(false);
            setPost(false);
            navigation.replace('Communities');
          }}
          color={search ? '#F7A10D'   : 'black'}
        />

        <SimpleLineIcons
          style={{ marginLeft: 5 }}
          name={'plus'}
          size={25}
          color={'black'}
          onPress={() => {
            setHome(false);
            setSearch(false);
            setNotification(false);
            setJobs(false);
            setPost(true);
            navigation.replace('Post');
          }}
        />

        <Octicons
          name="bell-fill"
          size={22}
          onPress={() => {
            setHome(false);
            setSearch(false);
            setNotification(true);
            setJobs(false);
            setPost(false);
            navigation.replace('Notifications');
          }}
          color={notification ? '#F7A10D'   : 'black'}
        />

        <MaterialCommunityIcons
          name="briefcase"
          size={25}
          onPress={() => {
            setHome(false);
            setSearch(false);
            setNotification(false);
            setJobs(true);
            setPost(false);
            navigation.replace('Jobs');
          }}
          color={jobs ? '#F7A10D'   : 'black'}
        />
      </Appbar>
    </PaperProvider>
  );
};
const styles = StyleSheet.create({
  bottom: {
   
    width:'100%' ,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    height: 10,
    paddingHorizontal:15, 
    
    justifyContent:"space-between",
    backgroundColor: 'white',
  
  
  


   
  },
  bottomFAB: {
    right: 130 ,
    height: "full"
   },
   button: {
    backgroundColor: 'black',
    borderRadius: 100,
    justifyContent:'center',
    justifyContent:"center",
    left:15

   
  },
  
 
});

export default BottomNavBar;