import React, { useState } from 'react';
import {MdPassword} from 'react-icons/md';
import { toast } from 'react-toastify'
import { resetPassword } from '../../services/authServices';
import { Link, useParams } from 'react-router-dom';

const initialState = {
  password: "",
  password2: ""
}

const Reset = () => {
const [formData, setFormData] = useState(initialState);
const {password, password2} = formData

const {hashedToken} = useParams()

const handleInputChange = (e) => {
  const {value, name} = e.target
  setFormData({...formData, [name]: value})
};

const reset = async (e) => {
  e.preventDefault()

  if(password.length < 6){
    return toast.error("Password length must be upto 6 characters")
  }
  if(password !== password2){
    return toast.error("Password do not match")
  }
  
  const userData = {
    password: "",
    password2: ""
  };
  try {
    const data = await resetPassword(userData, hashedToken)
    toast.success(data.message)
  } catch (error) {
    console.log(error.message)
  }

};

  return (
    <div className='auth'>
        <div className='form'>
            <div className='--flex-center'>
             <MdPassword size={35} color='#999'/>
            </div>
            <h2>Reset Password</h2>

            <form onSubmit={reset}>
                <input 
                type="password"
                placeholder='Password' 
                required
                name='password'
                value={password}
                onChange={handleInputChange}
                />

                <input 
                type="password"
                placeholder='Confirm New Password' 
                required
                name='password2'
                value={password2}
                onChange={handleInputChange}
                />
              <button type='submit' className='--btn --btn-primary --btn-block'>Reset Password</button>
              <div className='links'>
                <p>
                  <Link to="/" className='black'>Home</Link>
                </p>
                <p>
                  <Link to="/login" className='black'>Login</Link>
                </p>
              </div>
            </form>
        </div>
      
    </div>
  )
}

export default Reset
