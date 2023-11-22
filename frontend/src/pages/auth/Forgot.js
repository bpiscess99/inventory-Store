import React, { useState } from 'react';
import { AiOutlineMail } from 'react-icons/ai'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotUser, validateEmail } from '../../services/authServices';
import './auth.css';

const Forgot = () => {
    const [email, setEmail] = useState("");

const forgot = async (e) => {
    e.preventDafault();
    if(!email){
        return toast.error("Please enter an email")
    }

    if(!validateEmail(email)){
        return toast.error("Please enter a valid email")
    }

    const userData = {
        email,
    }
    await forgotUser(userData)
    setEmail("")
}    
  return (
    <div className='auth'>
        <div className='form'>
            <div className='--flex-center'>
               <AiOutlineMail size={35} color='#999'/>
            </div>
            <h2>Forgot Passwor</h2>

            <form onSubmit={forgot}>
                <input 
                type="email"
                placeholder='Email'
                required
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)} />

                <button type='submit' className='--btn --btn-primary --btn-block'>Get Reset Email</button>
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

export default Forgot
