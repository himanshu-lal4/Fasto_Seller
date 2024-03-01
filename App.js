import React, {useEffect} from 'react';
import Index from './src/navigation/Index';
import {registerNotifee} from './src/components/SendNotification';

const App = () => {
  //setup notification
  useEffect(() => {
    <registerNotifee/>;
  }, []);

  return <Index />;
};

export default App;
