import {configureStore} from '@reduxjs/toolkit';
// import { sharedSlice } from './slice';
import userTokenReducer from './userTokenSlice';
import CallingChannelReducer from './callingChannelSlice';
import IncomingUserReducer from './IncomingUserSlice';
const store = configureStore({
  reducer: {
    userToken: userTokenReducer,
    callingChannel: CallingChannelReducer,
    incomingUser: IncomingUserReducer,
  },
});

export default store;
