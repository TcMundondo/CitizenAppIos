
import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Text} from 'react-native';

import {  DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import {HomeWithProps } from './screens/HomeScreen';
import  { TrendingWithProps} from './screens/Trending';
import {ReportWithProps} from './screens/ReportScreen';
import {ThreadWithProps } from './screens/ThreadScreen';
import { SignOutWithProps} from './screens/SignOutScreen';
import {onAuthStateChanged, getAuth} from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";
import { ProfileWithProps, ProfileScreen } from './screens/ProfileScreen';
import AppHeaderLogo from './screens/components/AppHeaderLogo';
import { EditedProfileScreenProps }from './screens/EditedProfileScreen';
import PhoneVerification from "./screens/PhoneVerification";
import CoverPage from "./screens/CoverPage";
import { ReportPostWithProps} from './screens/ReportPost';
import { ReportUserWithProps} from './screens/ReportUser';
import { BlockUserWithProps} from './screens/BlockUser';
import { JobsWithProps } from './screens/Jobs';
import Notifications  from './screens/Notifications';
import {JobDisplayWithProps} from './screens/JobDisplay';
import Cancel from './screens/components/Cancel';
import BottomNavBarWrapper from './screens/components/BottomNavBarWrapper';
import AppHeaderWithSearch from './screens/components/AppHeaderWithSearch';
import AboutApp from './screens/AboutApp';
import { JobsResultsWithProps} from './screens/JobsResults';
import { SearhHeaderWithProps } from './screens/components/SearchHeader';
import { AddToThreadWithProps} from './screens/components/AddToThread';
import { CommunitiesWithProps } from './screens/Communities';
import CommunitiesHeader from './screens/components/CommunitiesHeader';
import { CommunityScreenWithProps } from './screens/CommunityScreen';
import ProfileHeader from './screens/components/ProfileHeader';
import { HomeSearchScreenWithProps} from './screens/HomeSearchScreen';
import VerificationCode from './screens/VerificationCode';
import MaintenaceInAction from './screens/MaintenaceInAction';

/*********************************************************************************************************************************** */




const Stack = createNativeStackNavigator();

const auth = getAuth();
const HomeWithPropsMemo = React.memo(HomeWithProps);

/*********************************************************************************************************************************** */

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};


/*********************************************************************************************************************************** */

const firebaseConfig = {
  apiKey: "AIzaSyAEnJGc5aY_6c7LEPlXNrUlzreF4_Decr0",
  authDomain: "citizen-cfd29.firebaseapp.com",
  projectId: "citizen-cfd29",
  storageBucket: "citizen-cfd29.appspot.com",
  messagingSenderId: "579850414033",
  appId: "1:579850414033:web:593a149e838e98a439e2f0",
  measurementId: "G-0YWZNDLZEB"
};

/*********************************************************************************************************************************** */

export default function App() {

  /*********************************************************************************************************************************** */
 const [isLoggedIn, setIsLoggedIn] = useState(false);

  /*********************************************************************************************************************************** */
  // int of firebase
  if (getApps().length === 0 ) {
    initializeApp(firebaseConfig);
} else {
  getApp();
}

   onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true) ;
        const uid = user.uid;
        // ...
      } else {
        setIsLoggedIn(false) ;
      }
    });


  /*********************************************************************************************************************************** */

 
    


 

 

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>

      {isLoggedIn ? // when user is signin in
      <Stack.Navigator initialRouteName="Home" screenOptions={{headerTintColor: '#F7A10D', }}>
        <Stack.Screen name="Home" component={HomeWithPropsMemo}  options={{ headerShown: false }}/>

        <Stack.Screen name="HomeSearch" component={HomeSearchScreenWithProps}  options={{ headerShown: false }}/>
        <Stack.Screen name="Post" component={ReportWithProps} options={{headerLeft: () => <Cancel/> , headerTitle: null }}/>

        <Stack.Screen name="AddToThread" component={AddToThreadWithProps}/>
        <Stack.Screen name="Thread" component={ThreadWithProps}/>
        <Stack.Screen name="Jobs" component={JobsWithProps} options={{ headerShown: false }} />
       <Stack.Screen name="JobsResults" component={JobsResultsWithProps}  options={{ headerTitle: () => <AppHeaderWithSearch />, }}/>
        <Stack.Screen name="JobPost" component={JobDisplayWithProps} options={{headerTitle: () => < Text style={{color:'#F7A10D' , justifyContent:'center', fontSize:18 ,fontWeight:'bold'}}>Job Post</Text>,}}/>
       <Stack.Screen name="Trending"  component={TrendingWithProps} options={{ headerTitle: () => <AppHeaderLogo/>,}}/>
       

       <Stack.Screen name="Profile" component={ProfileWithProps} options={{ headerShown: false }} />
       <Stack.Screen name="EditedProfile" component={EditedProfileScreenProps} options={{ headerShown: false }} />
        <Stack.Screen name="Notifications" component={Notifications} options={{headerTitle: () => <AppHeaderLogo/>,}}/>

        <Stack.Screen name="Communities" component={CommunitiesWithProps} options={{headerTitle: () => <CommunitiesHeader/>,}}/>

        <Stack.Screen name="Community" component={CommunityScreenWithProps}/>

        <Stack.Screen  name="MaintenaceInAction" component={MaintenaceInAction}/>
        
         <Stack.Screen name="ReportPost" component={ReportPostWithProps}/>
        <Stack.Screen name="ReportUser" component={ReportUserWithProps}/>  
        <Stack.Screen name="BlockUser" component={BlockUserWithProps}/>
        <Stack.Screen name="SignOutScreen" component={SignOutWithProps} options={{headerTitle: () => <AppHeaderLogo/>,}}/>
        
          

      </Stack.Navigator> :
      // when user is not signin 
        <Stack.Navigator screenOptions={{headerTintColor: '#F7A10D', }}>
            <Stack.Screen options={{ headerShown: false }} name="CoverPage" component={CoverPage}/>
            <Stack.Screen  name="LoginScreen" component={LoginScreen}/>
            <Stack.Screen  name="PhoneVerification" component={PhoneVerification}/>
            <Stack.Screen name="VerificationCode" component={VerificationCode}/>
       </Stack.Navigator>}
    </NavigationContainer>
</PaperProvider>
  );
}



  /*********************************************************************************************************************************** */