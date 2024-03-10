import {createSlice} from '@reduxjs/toolkit';
const initialState = {value: null};
export const IncomingUserSlice = createSlice({
  name: 'incomingUser',
  initialState,
  reducers: {
    addIncomingUser: (state, action) => {
      console.log('action.payload', action.payload);
      state.value = action.payload;
    },
  },
});

export const {addIncomingUser} = IncomingUserSlice.actions;
export default IncomingUserSlice.reducer;
