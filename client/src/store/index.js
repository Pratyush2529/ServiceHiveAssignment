import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gigReducer from './slices/gigSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        gigs: gigReducer,
    },
});
