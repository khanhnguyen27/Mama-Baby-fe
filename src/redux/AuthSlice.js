import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false
        }
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.error = false;
            state.login.currentUser = action.payload;
        },
        loginFailed: (state, action) => {
            state.login.isFetching = false;
            state.login.error = action.payload;
        },
        logOutSuccess: (state) => {
            state.login.currentUser = null;
            state.login.isFetching = false;
            state.login.error = false;
        },
        logOutFailed: (state, action) => {
            state.login.currentUser = null;
            state.login.isFetching = false;
            state.login.error = action.payload;
        }
    }
})

export const { loginStart, loginSuccess, loginFailed, logOutSuccess, logOutFailed } = AuthSlice.actions;
export default AuthSlice.reducer;