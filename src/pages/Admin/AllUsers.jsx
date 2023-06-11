import React, { useState ,useEffect} from 'react';
import { db } from '../../firebase/config';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './AllUsers.css';
import Spinner from '../../components/Spinner/Spinner';
import Navbar from '../../components/Navbar/Navbar';

const AllUsers = () => {
    const [loading,Setloading]=useState(false);
    const [errorMsg,SetErrorMsg] = useState("");
    const [successMsg,SetSuccessMsg] = useState("");
    const [users,SetUsers] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
     let login = localStorage.getItem("adminUser");
     if(!login){
      navigate('/login');
     }
    })

    useEffect(()=>{
        Setloading(true);
        const getUsers=()=>{
    
          const usersList = [];

          getDocs(collection(db,"users")).then((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
              usersList.push({...doc.data(),id:doc.id})
            })
              SetUsers(usersList);
              Setloading(false);
            SetSuccessMsg("Products Fetched");
          }).catch((error)=>{
            SetErrorMsg(error.message);
          })
        }
        getUsers();
      },[])
      console.log(users);
    
  return (
      <div className='all-users flex flex-col page-right'>
        <Navbar/>
        <Sidebar/>
        <p className='page-title'>All Users</p>
        {users&&
      <div className="user-details">
        <table>
          <thead>
            <tr>
              <th>Sr. no</th>
              <th>UserName</th>
              <th>Email</th>
              <th>Mobile Number</th>
            </tr>
        {users.map((user,key)=>(
            <tr key={key}>
                <td> {user.id}</td>
                <td   >{user.username}</td>
                <td  >{user.email}</td>
                <td  >{user.mobilenumber}</td>
            </tr>
        ))}
          </thead>
        </table>
    </div>}
    {
      !users&&<div><Spinner/></div>
    }
    </div>
  )
}

export default AllUsers