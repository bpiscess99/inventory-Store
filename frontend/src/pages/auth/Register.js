import React, { useState } from "react";
import { TiUserAddOutline } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { toast } from "react-toastify";
import { registerUser, validateEmail } from "../../services/authServices";
import {useDispatch} from 'react-redux';
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import Card from "../../components/card/Card";


const initialState = {
  name: "",
  email: "",
  password: "",
  password2: "",
};

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const { name, email, password, password2 } = formData;

 const handleInputChange = (e) => {
  const {name, value} = e.target;
  setFormData({...formData, [name]: value})
 }

 const register = async (e) => {
  e.preventDefault(); // data of form will not reload

  if(!name || !email| !password){
    return toast.error("All fields are required");
  }
  if(password.length < 6){
    return toast.error("Password must be upto 6 characters");
  }
  if(!validateEmail(email)){
    return toast.error("Please enter a valid email")
  }
  if(password !== password2){
    return toast.error("Please do not match")
  }

  const userData = {
    name,
    email,
    password,
  };
  setIsLoading(true)

  try {
    const data = await registerUser(userData);
    await dispatch(SET_LOGIN(true))
    await dispatch(SET_NAME(data.name))
    navigate("/dasboard")
    setIsLoading(false)
  } catch (error) {
    setIsLoading(false)
  }
 }

  return (
    <div className="auth">
      {isLoading && <Loader/>}
      <Card>
      <div className="form">
        <div className="--flex-center">
          <TiUserAddOutline size={35} color="#999" />
        </div>

        <h2>Register</h2>

        <form onSubmit={register}>
          <input
            type="text"
            placeholder="Name"
            required
            name="name"
            value={name}
            onChange={handleInputChange}
          />

          <input
            type="email"
            placeholder="Email"
            required
            name="email"
            value={email}
            onChange={handleInputChange}
          />

          <input
            type="password"
            placeholder="Password"
            required
            name="password"
            value={password}
            onChange={handleInputChange}
          />

          <input
            type="password"
            placeholder="Password2"
            required
            name="password2"
            value={password2}
            onChange={handleInputChange}
          />
        
          <button type="submit" className="--btn --btn-primary --btn-block">
            Register
          </button>
        </form>

        <span className="register">
          <Link className="black" to="/">Home</Link>
          <p> &nbsp; Already have an account? &nbsp;</p>
          <Link className="black"  to="/login">Login</Link>
        </span>
      </div>
      </Card>
    </div>
  );
};

export default Register;
