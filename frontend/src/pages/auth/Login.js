import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { BiLogIn } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';
import { toast } from 'react-toastify';
import { loginUser, validateEmail } from '../../services/authServices';
import { SET_LOGIN, SET_NAME } from '../../redux/features/auth/authSlice';
import Loader from '../../components/loader/Loader';

const initialState = {
    email: "",
    password: "",
}

const Login = () => {
const dispatch = useDispatch();    
const navigate = useNavigate();
const [isLoading, setIsLoading] = useState(false);
const [formData, setFormData] = useState(initialState);
const {email, password} = formData;

const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value})
};

const login = async (e) => {
 e.preventDefault();


if(!email || !password){
  return toast.error("All fields are required");
}

if(!validateEmail(email)){
    return toast.error("Please enter a valid email");
}

const userData = {
    email,
    password,
};
setIsLoading(true);
try {
    const data = await loginUser(userData);
    await dispatch(SET_LOGIN(true));
    await dispatch(SET_NAME(data.name));
    navigate("/dashboard");
    setIsLoading(false)
} catch (error) {
    setIsLoading(false)
}
};

  return (
    <div className='auth'>
        {isLoading && <Loader/>}
      <div className='form'>
        <div className='--flex-center'>
          <BiLogIn size={35} color="#999"/>
        </div>
        <h2>Login</h2>

        <form onSubmit={login}>
            <input 
            type="email"
            placeholder='Email'
            required
            name='email'
            value={email}
            onChange={handleInputChange} />

            <input 
            type="password"
            placeholder='Password'
            required
            name='password'
            value={password}
            onChange={handleInputChange} />

            <button type='sumbit' className='--btn --btn-primary --btn-block'>Login</button>
        </form>
        <Link to="/forgot" className='black'>Forgot Password</Link>

        <span className='login'>
        <Link to="/" className='black'>Home</Link>
        <p>&nbsp; Don't have an account? &nbsp;</p>
        <Link to="/register" className='black'>Register</Link>
        </span>
      </div>
      
    </div>
  )
}

export default Login
