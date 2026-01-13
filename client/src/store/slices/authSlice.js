import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;


axios.defaults.withCredentials = true;

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const checkAuth = createAsyncThunk('auth/check', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}/me`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(null);
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    await axios.get(`${API_URL}/logout`);
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: true,
        error: null,
    },
    reducers: {
        resetError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.data.user;
                state.loading = false;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload.data.user;
                state.loading = false;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.user = action.payload.data.user;
                state.loading = false;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.user = null;
                state.loading = false;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            });
    }
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;
