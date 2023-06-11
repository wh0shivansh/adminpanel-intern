import React, { useEffect, useState } from 'react';
import './Navbar.css';
import Logo from '../../assets/logo.jpg';
import { auth } from '../../firebase/config';
import { signOut } from "firebase/auth";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {BiLogOut} from "react-icons/bi"

const Navbar = () => {

  const location = useLocation();
  const [url,setUrl] = useState(null);

  useEffect(()=>{
    setUrl(location.pathname);
  },[location]);

    const navigate = useNavigate();

    const logOut=async()=>{
      signOut(auth).then(()=>{
        localStorage.clear();
        navigate('/');
      })
    }
    const [isActive,setIsActive] = useState(false);

    const toggleSidebar=()=>{
        setIsActive(!isActive);
    }

  return (
    <div className='navbar'>
        <div className={`hamburger-menu ${isActive ? 'open' : ''}`} onClick={toggleSidebar}>
      <span className="line"></span>
      <span className="line"></span>
      <span className="line"></span>
    </div>


        <div className={`nav-sidebar ${isActive?'sidebar-open':'sidebar-close'}`}>
        <div className="sidebar-title">
          <div className="logo">
            <img src={Logo} alt="" />
          </div>
          <p>Admin</p>
        </div>
        <ul>
            <li style={{width:'14rem'}} className={`bars ${(url==="/admin")?"active":"not-active"}`} ><Link className='link' to={'/admin'} >Dashboard</Link></li>
            <li style={{width:'14rem'}} className={`bars ${(url==="/addProduct")?"active":"not-active"}`} ><Link className='link' to="/addProduct">Add Medicines</Link></li>
            <li style={{width:'14rem'}} className={`bars ${(url==="/allproducts")?"active":"not-active"}`} ><Link className='link' to={"/allproducts"}>All Medicines</Link></li>
            <li style={{width:'14rem'}} className='logout' onClick={logOut}><Link to={"/"}> <BiLogOut/> Logout</Link></li>
        </ul>
        </div>

    </div>
  )
}

export default Navbar