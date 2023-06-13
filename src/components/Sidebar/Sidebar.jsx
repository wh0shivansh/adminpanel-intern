import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { signOut } from "firebase/auth";
import Logo from '../../assets/logo.jpg';
import { FaBackspace } from "react-icons/fa";
// import { useNavigate } from 'react-router-dom';
import {BiLogOut} from "react-icons/bi"
import { IoMdArrowRoundBack } from 'react-icons/io';


const Sidebar = () => {
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


  return (
    <>
    <div className='sidebar'>
        <div className="sidebar-title">
          <div className="logo">
            <img src={Logo} alt="" />
          </div>
          <p>Admin</p>
        </div>
        <ul>
            <li className={`bars ${(url==="/admin")?"active":"not-active"}`} ><Link className='link' to={'/admin'} >Dashboard</Link></li>
            <li className={`bars ${(url==="/addProduct")?"active":"not-active"}`} ><Link className='link' to="/addProduct">Add Medicines</Link></li>
            <li className={`bars ${(url==="/allproducts")?"active":"not-active"}`} ><Link className='link' to={"/allproducts"}>All Medicines</Link></li>
            <li className='logout' onClick={logOut}><Link to={"/"}> <BiLogOut/> Logout</Link></li>
              {/* <div className="free-box"></div> */}
            {/* <li className='logout' ><a href="">Logout</a></li> */}
        </ul>
    </div>

    <div className='backbtn'>
      {url !== "/admin"&&
      <button className='back'>
        <Link to={"/admin"}><IoMdArrowRoundBack size={40} color='#000'/></Link>
      </button>
      }
    </div>

    </>
  )
}

export default Sidebar