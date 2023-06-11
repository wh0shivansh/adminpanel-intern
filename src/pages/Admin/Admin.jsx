import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { FaUserAlt } from "react-icons/fa";
import { FaRegPlusSquare } from "react-icons/fa";
import { FaProductHunt } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { BiLogOut } from "react-icons/bi";
import { GiMedicines } from "react-icons/gi";
import './Admin.css';

// type Props = {}

const Admin = () => {
  var months = ["January", "February", "March", "April", "May", "June","July"," August", "September", "October", "November","December"];
  
  let newDate = new Date()
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  console.log(date+ " /"+month+"/"+year    )

  const navigate = useNavigate();
  useEffect(() => {
    let login = localStorage.getItem("adminUser");
    if (!login) {
      navigate("/login");
    }
  });

  const logOut = async () => {
    signOut(auth).then(() => {
      localStorage.clear();
      navigate("/");
    });
  };

  return (
    <>
      <div className="page-right admin-page">
        <Navbar />
        <Sidebar />
        <p className="admin-panel-text">ADMIN PANEL</p>

        <div className="text">
          <h2>Welcome Back Admin&nbsp;&nbsp; {months[month]+" "+date+","+year}</h2>
        </div>

        <div className="dashboardBtns">
          <Link className="deco-none" to={"/allproducts"}>
            <button className="dastbtn">
              <span><GiMedicines className="iconbtn" color="white" size={30} /></span>
              <a> All Medicines </a>
            </button>
          </Link>

          {/* <Link to={'/allusers'}><button className='dastbtn'> <FaUserAlt className='iconbtn' color='white' size={30}/> <a> All Users </a> </button></Link> */}

          <Link className="deco-none" to={"/addProduct"}>
            <button className="dastbtn">
              <span>

              <FaRegPlusSquare
                className="iconbtn"
                color="white"
                size={30}
                />
                </span>
              <a className="deco-none"> Add Medicines </a>
            </button>
          </Link>
          <button className="dastbtn" onClick={logOut}>
            {" "}
            <BiLogOut className="iconbtn" color="white" size={30} />{" "}
            <a> Logout </a>{" "}
          </button>
        </div>
      </div>
    </>
  );
};

export default Admin;
