
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import Home from "./pages/Home/Home.js"
import Register from './pages/auth/Register.js';
import Login from './pages/auth/Login.js';
import Forgot from './pages/auth/Forgot.js';
import Reset from './pages/auth/Reset.js';
import {SET_LOGIN} from "./redux/features/auth/authSlice.js";
import {useDispatch} from 'react-redux';
import { useEffect } from 'react';
import { getLoginStatus } from './services/authServices.js';
import Layout from './components/layout/Layout.js';
import Dashboard from './pages/dashboard/Dashboard.js';
import AddProduct from './pages/addProduct/AddProduct.js';
import SideBar from './components/sidebar/SideBar.js';
import ProductDetail from './components/product/productDetail/ProductDetail.js';
import EditProduct from './pages/ediProduct/EditProduct.js'
import axios from 'axios';
import Profile from './pages/profile/Profile.js';
import EditProfile from './pages/profile/EditProfile.js';
import Contact from './pages/contact/Contact.js';



axios.defaults.withCredentials = true;


function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    async function loginStatus(){
      const status = await getLoginStatus()
      dispatch(SET_LOGIN(status))
    }
    loginStatus()
  }, [dispatch]);


  return (
       <Router>
        <ToastContainer/>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/forgot" element={<Forgot/>}/>
      <Route path="/resetpassword/:resetToken" element={<Reset/>}/>

      <Route
      path='/dashboard'
      element={
      <SideBar>
      <Layout>
        <Dashboard/>
      </Layout>
      </SideBar>
      }
      />

      <Route
      path='/add-product'
      element={
        <SideBar>
          <Layout>
            <AddProduct/>
          </Layout>
        </SideBar>
      }
      />

      <Route 
      path='/product-detail/:id'
      element={
      <SideBar>
        <Layout>
          <ProductDetail/>
        </Layout>
      </SideBar>
      }
      />

      <Route 
      path='/edit-product/:id'
      element={
      <SideBar>
        <Layout>
          <EditProduct/>
        </Layout>
      </SideBar>}
      />

<Route 
      path='/profile'
      element={
      <SideBar>
        <Layout>
          <Profile/>
        </Layout>
      </SideBar>}
      />
     
     <Route 
      path='/edit-profile'
      element={
      <SideBar>
        <Layout>
          <EditProfile/>
        </Layout>
      </SideBar>}
      />

      <Route
      path="/contact-us"
      element={
        <SideBar>
         <Layout>
          <Contact/>
         </Layout>
        </SideBar>
      }
      />

     </Routes>
    </Router>

  ); 
}

export default App;
