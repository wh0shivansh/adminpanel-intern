import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { Link } from 'react-router-dom';
import {signInWithEmailAndPassword,getAuth} from 'firebase/auth';
import "./Login.css"


const Login = () => {

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [errorMsg,setErrorMsg]=useState("");
    const [successMsg,setSuccessMsg]=useState("");
    const auth = getAuth();
  
    const navigate = useNavigate();
  
    const handleSubmit=(e)=>{
      e.preventDefault();
      signInWithEmailAndPassword(auth,email,password)
      .then((userCredentials)=>{
        setSuccessMsg("Login Successfull");
        setEmail('');
        setPassword('');
        setErrorMsg('');
        setTimeout(() => {
          setSuccessMsg("");
            localStorage.setItem("loggedUser",true);
          navigate('/');
        }, 1000);
      })
      .catch((error)=>{
        if(error.message == "Firebase: Error (auth/invalid-email)."){
          setErrorMsg("Invalid Email or Pass");
        }else if(error.message == "Firebase: Error (auth/user-not-found)."){
          setErrorMsg("Invalid Credentials");
        }else if(error.message == "Firebase: Error (auth/wrong-password)."){
          setErrorMsg("Invalid Email or Pass");
        }
        else{
          setErrorMsg(error.message);
        }
      })
    }

    
  return (
    <div>
    <div className="login-container" onSubmit={handleSubmit}>
      <form className="login-form" on>
        <p>Log In</p>

        {successMsg&&<>
        <div className='success-msg'>
            {successMsg}
          </div></>}
          {errorMsg&&<>
        <div className='error-msg'>
            {errorMsg}
          </div></>}
        <label htmlFor="">Email</label>
        <input onChange={(e)=>setEmail(e.target.value)} type="email"  required/>
        <label htmlFor="">Password</label>
        <input onChange={(e)=>setPassword(e.target.value)} type="password" required/>
       <button type='submit' className='submit-btn'>Log In</button>
      <div>
        <span className='switch-login-signup'>Don't have an account?</span>
        <Link to="/signup"className='switch-btn'>Sign Up</Link>
      </div>
      <br />
      <br />
      </form>
    </div>
    
    <div className="developer">
          Shivansh Upadhyay
        </div>
  </div>
  )
}

export default Login