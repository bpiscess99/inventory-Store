import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {loginWithGoogleServices} from '../../../services/authServices'
import { toast } from "react-toastify";


const name = JSON.parse(localStorage.getItem("token"));

// const nameFromStorage = localStorage.getItem("token");
// const name = nameFromStorage ? JSON.parse(nameFromStorage) : "";

const initialState = {
    isLoading: false,
    isSuccess: false,
    isError: false,
    isLoggedIn: false,
    message: "",
    name: name ? name : "",
    user: {
        name: "",
        email: "",
        phone: "",
        bio: "",
        photo: "",
    },
};


// Login With Google
export const loginWithGoogle = createAsyncThunk(
    "auth/loginWithGoogle",
    async(userToken, thunkAPI) => {
        try {
            return await loginWithGoogleServices(userToken);
        } catch (error) {
            const message = 
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
                error.message ||
                error.toString();
                return thunkAPI.rejectWithValue(message);
        }
    }
);



const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        SET_LOGIN(state, action){
            state.isLoggedIn = action.payload;
        },
        SET_NAME(state, action){
            localStorage.setItem("name", JSON.stringify(action.payload));
            state.name = action.payload;
        },
        SET_USER(state, action){
            const profile = action.payload;
            state.user.name = profile.name;
            state.user.email = profile.email
            state.user.phone = profile.phone
            state.user.bio = profile.bio
            state.user.photo = profile.photo
        },
    },
    extraReducers: (builder) => {
        builder
      // loginWithGoogle
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isLoggedIn = true;
         state.user = action.payload;
        toast.success("Login Successful");
        console.log(action.payload)
    })
    .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
        toast.error(action.payload);
    })
    }
});

export const { SET_LOGIN, SET_NAME, SET_USER} = authSlice.actions;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectName = (state) => state.auth.name;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;