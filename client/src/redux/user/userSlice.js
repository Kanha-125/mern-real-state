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
        },
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        updateUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUSerStart: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signOutUSerStart: (state) => {
            state.loading = true;
        },
        signOutUserSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
        signOutUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }

    }
})

export const { signInFailure, signInStart, signInSuccess, updateUserStart, updateUserSuccess, updateUserFailure, deleteUSerStart, deleteUserSuccess, deleteUserFailure, signOutUSerStart, signOutUserFailure, signOutUserSuccess } = userSlice.actions;

export default userSlice.reducer;