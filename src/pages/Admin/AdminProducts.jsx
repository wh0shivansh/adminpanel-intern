import React, { useState } from 'react';
import './AddProducts.css';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Link, useNavigate } from 'react-router-dom';
import UpdateProducts from './UpdateProducts';
import './Admin.css';
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { BiDetail } from "react-icons/bi";

const AdminProducts = ({ products, category, index }) => {
  // console.log("Products = "+);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPopup, setIsPopup] = useState(false);
  const [isPopupBg, setIsPopupBg] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const product = products.product;
  const navigate = useNavigate();
  const handleDelete = async (id, category) => {
    console.log(id);
    console.log(category);
  }
  const showPopup = () => {
    setIsPopupBg(true);
    setIsPopup(true);
  }
  const disablePopup = () => {
    setIsPopup(false);
    setIsPopup(false);
  }
  return (
    <>
      {category == "" && product &&products.images&&
        <tr>
          <td>{index + 1}</td>
          <td><div className='table-img'><img src={products.images[0]} />  </div></td>
          <td>{product.productName}</td>
          <td>{product.brandName}</td>
          <td>{product.category}</td>
          <td>{product.price}</td>
          <td>{product.countInStock}</td>
          <td style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', border: 'none', borderTop: '1px solid #000', paddingTop: '27px' }}>
            <span><Link to={'/updateProducts'} state={{ id: products.id, product: product }}><AiFillEdit size={20} color='#1a1a1d' /></Link></span>
            <span><span onClick={async () => {
              const deleteRef = doc(db, `products/${products.id}`);
              await deleteDoc(deleteRef)
                .then(() => {
                  setSuccessMsg("Deleted Successfully");
                  console.log(successMsg);
                  navigate(0);
                }).catch((error) => {
                  setErrorMsg(error.message);
                })
            }} > <MdDelete size={20} color='#1a1a1d' /> </span></span>
            <span><p className='pointer' onClick={showPopup}><BiDetail size={20} color='#1a1a1d' /></p></span>
          </td>
        </tr>
      }
      {isPopup &&
      <div className='popup-bg'>
        <div className="popup">
          <div className="close-popup pointer" onClick={disablePopup}>X</div>
          <p className='p'>{`Details of ${product.productName}`}</p>
          <span className='popup-span'>

          <div className="popup-details">
            <p className='info'><p>Molecule:&nbsp;</p> {product.molecule}</p>
            <p className='info'><p>Expiry Date:&nbsp;</p> {product.expDate}</p>
            <p className='info'><p>Salt:&nbsp;</p> {product.salt1}</p>
            <p className='info'><p>Power of salt:&nbsp;</p> {product.powerSalt1}mg</p>
            <p className='info'>
        <p>Details: </p>
            <textarea className='text-area'  value={product.productDetails}></textarea>
            </p>
            {/* <p className='info'><p>Details:&nbsp;</p> {product.productDetails}</p> */}
          </div>
          <div className='popup-images'>
            {products.images.map((image) => (
              <div className='popup-img-span'><img src={image} className='popup-image'></img></div>
              ))}
          </div>
              </span>
        </div>
              </div>
      }
      {
        category != "" && product.category == category &&products.images&&
        <tr>
          <td>{index + 1}</td>
          <td><div className='table-img'><img src={products.images[0]} /></div></td>
          <td>{product.productName}</td>
          <td>{product.brandName}</td>
          <td>{product.category}</td>
          <td>{product.price}</td>
          <td>{product.countInStock}</td>
          <td style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center',  border: 'none', borderTop: '1px solid #000', paddingTop: '27px' }}>
            <span><Link to={'/updateProducts'} state={{ id: products.id, product: product }}><AiFillEdit size={20} color='#1a1a1d' /></Link></span>
            <span><span onClick={async () => {
              const deleteRef = doc(db, `products/${products.id}`);
              await deleteDoc(deleteRef)
                .then(() => {
                  setSuccessMsg("Deleted Successfully");
                  console.log(successMsg);
                  navigate(0);
                }).catch((error) => {
                  setErrorMsg(error.message);
                })
            }} > <MdDelete size={20} color='#1a1a1d' /> </span></span>
            <span><p className='pointer' onClick={showPopup}><BiDetail size={20} color='#1a1a1d' /></p></span>
          </td>
        </tr>
      }
    </>
  )
}

export default AdminProducts