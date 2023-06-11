import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {auth,db} from '../../firebase/config';
import {collection,addDoc} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import "./SignUp.css"


const SignUp = () => {
    const [userName,setUserName] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [mobilenumber,setMobileNumber] = useState("");
    
    const navigate = useNavigate();
    const [errorMsg,setErrorMsg] = useState("");
    const [successMsg,setSuccessMsg] = useState("");


    const handleSubmit=(e)=>{
        e.preventDefault();
        createUserWithEmailAndPassword(auth,email,password)
        .then((userCredentials)=>{
          const user = userCredentials.user;
          console.log(user);
    
          addDoc(collection(db,"users"),{
            username:userName,
            email:email,
            password:password,
            mobilenumber:mobilenumber,
            uid:user.uid
          }).then(()=>{
            setSuccessMsg("Registered Successfully!");
            setUserName("");
            setPassword("");
            setEmail("");
            setMobileNumber("");
            setErrorMsg("");
    
            setTimeout(() => {
                setSuccessMsg("");
                navigate('/login');
            }, 1000);
          })
          .catch((error)=>{setErrorMsg(error.message)});
        })
        .catch((error)=>{
          if(error.message=='Firebase: Error (auth/invalid-email).'){
            setErrorMsg("Fill all the required field");
          }
        })
      }

  return (
    <div className='signup'>

    <div className="signup-container" >
      <form className="signup-form" onSubmit={handleSubmit}>
        <p>Create Account</p>

        {successMsg&&<>
        <div className='msg-box'>
            {successMsg}
          </div></>}  
          {errorMsg&&<>
        <div className='msg-box'>
            {errorMsg}
          </div></>}

        <label htmlFor="">Your Name</label>
        <input onChange={(e)=>setUserName(e.target.value)} type="text" />
        <label htmlFor="">Mobile Number</label>
        <input onChange={(e)=>setMobileNumber(e.target.value)} type="tel"  />
        <label htmlFor="">Email</label>
        <input onChange={(e)=>setEmail(e.target.value)} type="email" />
        <label htmlFor="">Password</label>
        <input onChange={(e)=>setPassword(e.target.value)} type="password"  />
       <button type='submit'className='submit-btn'>Sign Up</button>
      <div>
        <span className='switch-login-signup'>Already have an account?</span>
        <Link to="/login" className='switch-btn'> Log In</Link>
      </div>
      </form>
    </div>
  </div>
  )
}

export default SignUp