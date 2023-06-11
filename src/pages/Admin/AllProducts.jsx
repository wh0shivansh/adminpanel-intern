import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import AdminProducts from './AdminProducts';
import { Link, useNavigate } from 'react-router-dom';
import { GrAdd } from "react-icons/gr"
import Spinner from '../../components/Spinner/Spinner';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import './AllProducts.css';

const AllProducts = () => {
  const navigate = useNavigate();
useEffect(()=>{
 let login = localStorage.getItem("adminUser");
 if(!login){
  navigate('/login');
 }
})
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setcategories] = useState([]);
  const [options, setOptions] = useState("");
  const [path, setPath] = useState("");
  const [loading, setloading] = useState(false);
  const [count, setcount] = useState(1);
  // let path = '';
  // function changePath(path){
  //     setPath(`${path}`);
  //     console.log("Path Changed= "+path);
  //   }


  // FETCHING PRODUCTS FOR ADMIN 
  useEffect(() => {
    setloading(true);
    const getProducts = () => {
      const productsList = [];
      getDocs(collection(db, "products")).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          productsList.push({ ...doc.data(), id: doc.id })
        })
        setProducts(productsList);
        setloading(false);
        setSuccessMsg("Products Fetched");
      }).catch((error) => {
        // console.log(error.message);
        setErrorMsg(error.message);
      })
    }
    getProducts();
  }, [path])
  console.log(products);


  // FETCHING CATEGORIES FOR ADMIN 
  function GetCategories() {
    useEffect(() => {
      const getCategories = async () => {
        const docRef = doc(db, 'categories', `${localStorage.getItem('categoryId')}`);
        const docSnap = await getDoc(docRef);
        setcategories(docSnap.data().category);
        // console.log("Categories = "+docSnap.data().category);
      }
      getCategories();

    }, [localStorage.getItem('categoryId')])
    return categories
  }
  GetCategories();

  // // HANDLING CATEGORY CHANGES 
  const handleCategoryChange = (e) => {
    console.log(e.target.value);
    const c = (e.target.value);
    setPath(`${c}`);
  }

  return (
    <>


      {categories && products &&
        <div className='admin page-right'>
          <Navbar/>
          <Sidebar />

        <p className='page-title'>All Products</p>


          <div className="admin-dashboard">


            <div className="categories ">
              <select className='select-category' id="" onChange={handleCategoryChange}>
                <option value="default" hidden>Select Category</option>
                {
                  categories.map((c, key) => {
                    return <option key={key} value={`${c}`}>{c}</option>
                  })
                }
              </select>
              <div className="add-products">
              </div>
            </div>

            {loading ? <span><Spinner /></span> :
              <div className="admin-products">

                <table>
                  <thead>
                    <tr>
                      <th>Sno.</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Brand</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>InStock</th>
                      <th>Options</th>
                    </tr>
                    {products.map((product,index) => (
                      <AdminProducts key={product.id} products={product} category={path} index={index}/>
                      // setcount(setcount);
                    ))}
                  </thead>
                </table>

              </div>
            }

          </div>


        </div>
      }
    </>

  )
}

export default AllProducts