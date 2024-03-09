import {configureStore} from '@reduxjs/toolkit';
// import { sharedSlice } from './slice';
import userTokenReducer from './userTokenSlice';
import CallingChannelReducer from './callingChannelSlice';
const store = configureStore({
  reducer: {
    userToken: userTokenReducer,
    callingChannel: CallingChannelReducer,
  },
});

export default store;
