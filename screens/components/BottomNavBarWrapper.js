
import React, { useState } from 'react';
import BottomNavBar from './bottomNavBar';

const BottomNavBarWrapper = ({ children }) => {
    const [home, setHome] = useState(false);
    const [search, setSearch] = useState(false);
    const [notification, setNotification] = useState(false);
    const [jobs, setJobs] = useState(false);
    const [post, setPost] = useState(false);
  
    return (
      <View style={{ flex: 1 }}>
        {children}
        <BottomNavBar
          home={home}
          setHome={setHome}
          search={search}
          setSearch={setSearch}
          notification={notification}
          setNotification={setNotification}
          jobs={jobs}
          setJobs={setJobs}
          post={post}
          setPost={setPost}
        />
      </View>
    );
  };
  export default BottomNavBarWrapper ;