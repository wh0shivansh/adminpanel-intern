import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './UpdateProduct.css';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import Spinner from '../../components/Spinner/Spinner';
import { IoIosArrowBack } from 'react-icons/io';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';

const UpdateProducts = () => {

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    const [images, setImages] = useState();
    const [urls, setUrls] = useState('');
    const [isExist, setIsExist] = useState(false);
    const [isExistCat, setIsExistCat] = useState(false);

    const [uploadError, setUploadError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const location = useLocation();
    const [imageError, setImageError] = useState('');
    const [loading, Setloading] = useState(false);


    const navigate = useNavigate();
    useEffect(() => {
        let login = localStorage.getItem("adminUser");
        if (!login) {
            navigate('/login');
        }
    })
    const { product } = location.state;
    const { id } = location.state;
    const [expDate, setExpDate] = useState("");

    const [brandName, setBrandName] = useState("");
    const [category, setCategory] = useState("");
    const [countInStock, setCountInStock] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState("");
    const [productDetails, setProductDetails] = useState("");
    const [productName, setProductName] = useState("");
    const [salt1, setSalt1] = useState("");
    const [powerSalt1, setPowerSalt1] = useState("");
    const [molecule, setMolecule] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [oldcat,setoldcat]=useState('');

    useEffect(() => {
        if (!product) {
            navigate('/admin')
        }

        else {
            setBrandName(product.brandName);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setImage(product.image);
            setMolecule(product.molecule);
            setPrice(product.price);
            setProductDetails(product.productDetails);
            setProductName(product.productName);
            setSalt1(product.salt1);
            setPowerSalt1(product.powerSalt1);
            setoldcat(product.category);
            setExpDate(product.expDate);

        }
    }, []);



    const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG']

    const uploadFiles = async (docId) => {
        if(images){
        const imageRef = ref(storage, `/images/${images.name}`);
        const downloadURLs = []
        for (let i = 0; i < images.length; i++) {
            const imageRef = ref(storage, `product-images/${category}/${images[i].name}_${Date.now()}`);
            uploadBytes(imageRef, images[i]).then(async () => {
                const downloadURL = await getDownloadURL(imageRef);
                downloadURLs.push(downloadURL);
                console.log("DID2 = " + docId);
                await updateDoc(doc(db, "products", docId), {
                    images: arrayUnion(downloadURL),
                }).then(() => {
                    setImageError(false);
                }).catch((err) => {
                    setImageError(true);
                    console.log(err.message);
                })
            })
        }
    }
        if (!imageError) {
            console.log("Uploaded Everything");
            setSuccessMsg("Adding Product");
            if (category!=oldcat) {
                await updateDoc(doc(db, "categories", `${localStorage.getItem('categoryId')}`), {
                    category: arrayUnion(`${category}`),
                }).then(() => {
                    setSuccessMsg('Product added successfully');
                    navigate('/');
                })
            }else{
                
                navigate('/');
            }

        }
    }

    
    const ResetFields=()=>{
        setBrandName("");
        setProductName("");
        setProductDetails("");
        setCountInStock("");
        setMolecule("");
        setSalt1("");
        setPowerSalt1("");
        setImages(null);
        setImages("");
        setPrice("");
    }



    const handleUpdateProducts = (e) => {
        Setloading(true);
        e.preventDefault();
        updateDoc(doc(db, `products`, `${id}`), {
            product: {
                brandName,
                category,
                countInStock,
                price,
                productDetails,
                productName,
                salt1,
                powerSalt1,
                molecule,
                expDate,
            }

        }).catch((error) => { 
            setUploadError(error.message)
         });
         if(id){
            uploadFiles(id);
        }


    }



    return (
        <div className='addprod-container page-right flex-col'>
            <Navbar />
            <Sidebar />
            <p className='page-title'>Update Products</p>
            {product &&
                <div>
                    <form action="" className='addprod-form' onSubmit={handleUpdateProducts}>
                        {
                            successMsg &&
                            <>
                                <div className="success-msg">
                                    {successMsg}
                                </div>
                            </>
                        }
                        {
                            uploadError &&
                            <>
                                <div className="error-msg">
                                    {uploadError}
                                </div>
                            </>
                        }
                        <label htmlFor="">Brand Name</label>
                        <input type="text" placeholder={`${product.brandName}`} onChange={(e) => { setBrandName(e.target.value) }} />
                        <label>Category</label>
                        <input onChange={(e) => setCategory(e.target.value)} placeholder={`${product.category}`} type="text" />
                        <label>In Stock</label>
                        <input onChange={(e) => setCountInStock(e.target.value)} placeholder={`${product.countInStock}`} type="number" />
                        <label>Molecule of Medicine</label>
                        <input onChange={(e) => setMolecule(e.target.value)} placeholder={`${product.molecule}`} type="text" />
                        <label>Price</label>
                        <input onChange={(e) => setPrice(e.target.value)} placeholder={`${product.price}`} type="number" />


                        <label>Image</label>
                        <input onChange={(e) => {
                            setImages(e.target.files);
                            if (e.target.files.length > 5) {
                                alert("Only Five images accepted");
                                e.preventDefault();
                                ResetFields();
                            }
                        }} type="file" multiple />
                        {imageError && <>
                            <div className='error-msg'>{imageError}</div>
                        </>}
                        <label>Details</label>
                        <textarea onChange={(e) => setProductDetails(e.target.value)} placeholder={`${product.productDetails}`}></textarea>
                        <label>Name</label>
                        <input onChange={(e) => setProductName(e.target.value)} placeholder={`${product.productName}`} ></input>
                        <label>Salt </label>
                        <input onChange={(e) => setSalt1(e.target.value)} placeholder={`${product.salt1}`} type="text" />
                        <label>Power Of Salt(mg)</label>
                        <input onChange={(e) => setPowerSalt1(e.target.value)} placeholder={`${product.powerSalt1}`} type="number" />
                        <label>Expiry Date</label>
                            <input type="date" value={expDate} onChange={(e)=>{setExpDate(e.target.value)}}  min={`${year}-${month}-${date}`} max={"2030-12-31"}></input>
                        {loading ? <Spinner /> : <button type='submit'>Update</button>
                        }
                        {/* <Link to={'/admin'}><IoIosArrowBack size={20}/>Back</Link> */}
                    </form>
                </div>
            }
        </div>
    )
}

export default UpdateProducts