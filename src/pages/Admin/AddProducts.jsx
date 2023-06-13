import React, { useState, useEffect } from 'react'
import { auth, db, storage } from '../../firebase/config'
import { collection, getDocs, query, where, doc, updateDoc, addDoc, arrayUnion, setDoc, getDoc } from 'firebase/firestore'
import './Admin.css'
import './AddProducts.css'
import { Link, useNavigate } from 'react-router-dom'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import Spinner from '../../components/Spinner/Spinner'
import { IoIosArrowBack } from 'react-icons/io';
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'

const AddProducts = () => {

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    const [categories, setcategories] = useState([]);
    const [images, setImages] = useState();
    const [urls, setUrls] = useState('');
    const [brandName, setBrandName] = useState("");
    const [category, setCategory] = useState("");
    const [countInStock, setCountInStock] = useState("");
    const [price, setPrice] = useState("");
    const [productDetails, setProductDetails] = useState("");
    const [productName, setProductName] = useState("");
    const [salt1, setSalt1] = useState("");
    const [powerSalt1, setPowerSalt1] = useState("");
    const [molecule, setMolecule] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [expDate, setExpDate] = useState("");
    const [loading, Setloading] = useState(false);
    const [isExist, setIsExist] = useState(false);
    const [isExistCat, setIsExistCat] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        let login = localStorage.getItem("adminUser");
        if (!login) {
            navigate('/login');
        }
    })
    const [imageError, setImageError] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [uploadError, setUploadError] = useState('');


    function GetCurrentUser() {
        const [user, setUser] = useState(null);
        const usersCollectionRef = collection(db, "users");
        useEffect(() => {
            auth.onAuthStateChanged(userlogged => {
                if (userlogged) {
                    // console.log(userlogged.email)
                    const getUsers = async () => {
                        const q = query(usersCollectionRef, where("uid", "==", userlogged.uid));
                        console.log(q);
                        const data = await getDocs(q);
                        setUser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
    // if (loggedUser) { console.log(loggedUser[0].email) }

    const types = ['image/jpg', 'image/JPG', 'image/jpeg', 'image/png', 'image/PNG'];

    const uploadFiles = async (docId) => {
        if (images){
            const imageRef = ref(storage, `/images/${images.name}`);
            const downloadURLs = [];

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
            for (let i = 0; i < categories.length; i++) {
                if (categories[i] == category.toLowerCase()) {
                    setIsExistCat(true);
                }
            }
            if (!isExistCat) {
                await updateDoc(doc(db, "categories", `${localStorage.getItem('categoryId')}`), {
                    category: arrayUnion(`${category}`),
                }).then(() => {
                    setSuccessMsg('Product added successfully');
                    navigate('/');
                })
            }
        }
    }


    const [products, setProducts] = useState([]);
    // FETCHING PRODUCTS FOR ADMIN 
    useEffect(() => {
        Setloading(true);
        const getProducts = () => {
            const productsList = [];
            getDocs(collection(db, "products")).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    productsList.push({ ...doc.data(), id: doc.id })
                })
                setProducts(productsList);
                Setloading(false);
            }).catch((error) => {
                // console.log(error.message);
                setErrorMsg(error.message);
            })
        }
        getProducts();
    }, [])


    const handleAddProduct = async (e) => {
        e.preventDefault();
        Setloading(true);
        const q = query(collection(db, "products"),where("product.productName","==",productName.toLowerCase()),where("product.powerSalt1","==",powerSalt1),where("product.brandName","==",brandName.toLowerCase()));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            addNewProduct(e);
            setSuccessMsg("Product Adding...");
        } else {
            window.scrollTo(0,0);
            setErrorMsg("Product Already Exists");
            Setloading(false);
        }
    }


    const addNewProduct = async (e) => {
        setProductName(productName.toLowerCase());
        setCategory(category.toLowerCase());
        e.preventDefault();
        const docref = await addDoc(collection(db, `products`), {
            product: {
                brandName:brandName.toLowerCase(),
                category:category.toLowerCase(),
                countInStock,
                price,
                productDetails,
                productName:productName.toLowerCase(),
                salt1,
                powerSalt1,
                molecule,
                expDate,
            }
        }).catch(err => {
            setErrorMsg(err.message);
        });
        if (docref) {
            console.log(docref.id);
            uploadFiles(docref.id);
        }


    }

    const ResetFields = () => {
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



    // FETCHING CATEGORIES FOR ADMIN 
    function GetCategories() {
        useEffect(() => {
            const getCategories = async () => {
                const docRef = doc(db, 'categories', `${localStorage.getItem('categoryId')}`);
                const docSnap = await getDoc(docRef);
                setcategories(docSnap.data().category);
            }
            getCategories();

        }, [localStorage.getItem('categoryId')])
        return categories
    }
    GetCategories();


    return (
        <div className='addprod-container page-right flex-col'>
            <Navbar />
            <Sidebar />
            <p className='page-title'>Add Products</p>
            {
                loggedUser && loggedUser[0].email === "med@virumalmedicalhall.com" ?
                    <div>
                        <form action="" className='addprod-form' onSubmit={handleAddProduct}>
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
                            {
                                errorMsg &&
                                <>
                                    <div className="error-msg">
                                        {errorMsg}
                                    </div>
                                </>
                            }
                            <label htmlFor="">Brand Name</label>
                            <input type="text" placeholder='Brand Name' value={brandName} onChange={(e) => { setBrandName(e.target.value) }} required/>
                            <label>Category</label>
                            <input onChange={(e) => setCategory(e.target.value)} value={category} type="text" placeholder="Category" required/>
                            <label>Name</label>
                            <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Medicine Name" required/>
                            <label>In Stock</label>
                            <input onChange={(e) => setCountInStock(e.target.value)} type="number" value={countInStock} placeholder="In Stock Value" required/>
                            <label>Molecule of Medicine</label>
                            <input onChange={(e) => setMolecule(e.target.value)} type="text" value={molecule} placeholder="Molecule of Medicine" />
                            <label>Price</label>
                            <input onChange={(e) => setPrice(e.target.value)} type="number" value={price} placeholder="Price" required/>
                            <label>Image</label>
                            <input onChange={(e) => {
                                setImages(e.target.files);
                                if (e.target.files.length > 5) {
                                    alert("Only Five images accepted");
                                    e.preventDefault();
                                    ResetFields();
                                }
                            }} type="file" accept='image/*' multiple required/>
                            {imageError && <>
                                <div className='error-msg'>{imageError}</div>
                            </>}

                            <label>Details</label>
                            <textarea value={productDetails} onChange={(e) => setProductDetails(e.target.value)} placeholder="Enter details of Medicine"></textarea>
                            
                            <label>Salt </label>
                            <input value={salt1} onChange={(e) => setSalt1(e.target.value)} type="text" placeholder="Salt Name" required/>
                            <label>Power Of Salt(mg)</label>
                            <input value={powerSalt1} onChange={(e) => setPowerSalt1(e.target.value)} type="number" placeholder="Power of salt(mg)" required/>
                            <label>Expiry Date</label>
                            <input type="date" value={expDate} onChange={(e) => { setExpDate(e.target.value) }} min={`${year}-${month}-${date}`} max={"2030-12-31"} required />
                            {/* <label>Salt 2 </label>
                <input onChange={(e) => setSalt2(e.target.value)} type="text" placeholder="Enter Price without tax" />
                <label>Power Of Salt 2(mg)</label>
                <input onChange={(e) => setPowerSalt2(e.target.value)} type="number" placeholder="Customer Support Email, Phone or address" /> */}


                            {loading ? <Spinner /> : <button type='submit'>Add</button>}
                            {/* <button><Link to={'/admin'}><IoIosArrowBack/>Back</Link></button> */}
                            <br />
                            <br />


                        </form>
                    </div>
                    : <div><Spinner /></div>
            }
        </div>
    )
}

export default AddProducts
