import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/gigs`;

export const fetchGigs = createAsyncThunk('gigs/fetchAll', async (search = '', thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}?search=${search}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

export const createGig = createAsyncThunk('gigs/create', async (gigData, thunkAPI) => {
    try {
        const response = await axios.post(API_URL, gigData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});

const gigSlice = createSlice({
    name: 'gigs',
    initialState: {
        gigs: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGigs.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchGigs.fulfilled, (state, action) => {
                state.gigs = action.payload.data.gigs;
                state.loading = false;
            })
            .addCase(fetchGigs.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(createGig.fulfilled, (state, action) => {
                state.gigs.unshift(action.payload.data.gig);
            });
    }
});

export default gigSlice.reducer;
