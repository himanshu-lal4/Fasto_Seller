import {createSlice} from '@reduxjs/toolkit';
const initialState = {value: null};
export const CallingChannelSlice = createSlice({
  name: 'callingChannel',
  initialState,
  reducers: {
    addChannelId: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {addChannelId} = CallingChannelSlice.actions;
export default CallingChannelSlice.reducer;
