import React, {useEffect} from 'react';
import Index from './src/navigation/Index';
import {registerNotifee} from './src/components/SendNotification';
import store from './src/redux/store';
import {Provider} from 'react-redux';

import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {registerNotificationHandlers} from './src/utils/Messaging';
const App = () => {
  return (
    <Provider store={store}>
      <Index />
    </Provider>
  );
};

export default App;
