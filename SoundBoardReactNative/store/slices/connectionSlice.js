import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isConnected: false,
  ip: '',
  port: '',
};

const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setConnection(state, action) {
      state.isConnected = action.payload.isConnected;
      state.ip = action.payload.ip;
      state.port = action.payload.port;
    },
  },
});

export const { setConnection } = connectionSlice.actions;

export const selectConnection = (state) => state.connection;

export default connectionSlice.reducer;
