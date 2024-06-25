import { configureStore } from '@reduxjs/toolkit';
import connectionReducer from './slices/connectionSlice';

const store = configureStore({
  reducer: {
    connection: connectionReducer,
  },
});

export default store;