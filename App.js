import React, {useEffect} from 'react';
import Index from './src/navigation/Index';
import {registerNotifee} from './src/components/SendNotification';
import store from './src/redux/store';
import {Provider} from 'react-redux';
import notifee from '@notifee/react-native';
async function requestNotificationPermission() {
  await notifee.requestPermission();
}

// Call the function to request permission
requestNotificationPermission();

const App = () => {
  return (
    <Provider store={store}>
      <Index />
    </Provider>
  );
};

export default App;
