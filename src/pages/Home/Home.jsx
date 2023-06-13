import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Home = () => {
    const navigate = useNavigate();
    // FETCH USER DETAILS 
    function GetCurrentUser() {
        const [user, setUser] = useState("");
        const userCollectionRef = collection(db, "users")
    
        useEffect(() => {
          auth.onAuthStateChanged(userlogged => {
            if (userlogged) {
              const getUsers = async () => {
                const q = query(collection(db, "users"), where("uid", "==", userlogged.uid))
                const data = await getDocs(q);
                setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
              };
              getUsers();
            }
            else {
              setUser(null);
            }
          })
        }, [])
        return user
      }
      const loggedUser = GetCurrentUser();
      // console.log("Logged User = "+loggedUser[0].categoryId);



    // USER AUTHENTICATION CHECKING 
useEffect(()=>{
  let login = localStorage.getItem("loggedUser");
  if(!login){
    navigate('/login');
  }
})
useEffect(()=>{
  if(loggedUser){
    if(loggedUser[0].email == "med@virumalmedicalhall.com"){
      localStorage.setItem("adminUser",true);
      localStorage.setItem("categoryId",loggedUser[0].categoryId);
      navigate('/admin');
    }
  }
})

    return (
      
        <div>
Home Page
        </div>
    )
}

export default Home