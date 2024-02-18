import axios from 'axios';
import {toast} from 'react-toastify';

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api/users/`;

export const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
};  

// Register
export const registerUser = async(userData) => {
    try {
        const response = await axios.post(API_URL + "register", userData,
        {withCredentials: true}
        );
        if(response.statusText === "OK"){
            toast.success("User Registered Successfully")
        }
        return response.data
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
        toast.toString();
        toast.error(message)
    }
};

// Login

export const loginUser = async(userData) => {
    try {
        const response = await axios.post(API_URL + "login", userData
        );
        if(response.statusText === "OK"){
            toast.success("User Login Successfully");
        }
        return response.data;
    } catch (error) {
        const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
        toast.error(message)
    }
};

// Logout
export const logoutUser = async()=> {
    try {
      await axios.get(API_URL + "logout",);
    } catch (error) {
        const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
        toast.error(message)
    }
};

// Forgot Password
export const forgotUser = async (userData) => {
    try {
        const response = await axios.post(API_URL + "forgotpassword",
        userData
        );
        toast.success(response.data.message);
    } catch (error) {
        const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
        toast.error(message)
    }
};

// Reset Password 
export const resetPassword = async (userData, resetToken) => {
    try {
        const response = await axios.put(API_URL + `resetpassword/${resetToken}`,
        userData
        );
        return response.data
    } catch (error) {
        const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
        toast.error(message)         
    }
};

// Get login Status
export const getLoginStatus = async () => {
    try {
        const response = await axios.get(API_URL + "loggedin");
        return response.data
    } catch (error) {
        const message =
        (error.response && error.response.data & error.response.data.messge) ||
        error.message ||
        error.toString()
        toast.error(message)
    }
};

// Get User Profile
export const getUser = async () => {
    try {
        const response = await axios.get(API_URL + "getuser");
        return response.data
    } catch (error) {
        const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
        toast.error(message)
    }
};

// update Profile
export const changePassword = async () => {
    try {
        const response = await axios.patch(API_URL + "changepassword",
        FormData
        );
        return response.data
    } catch (error) {
        const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
        toast.error(message)
}
}