import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    error: null,
    loading: false,
    currentUser: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state, action) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }

    }
})

export const { signInFailure, signInStart, signInSuccess } = userSlice.actions;

export default userSlice.reducer;