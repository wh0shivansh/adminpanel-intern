import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Home from './pages/Home/Home';
import Admin from './pages/Admin/Admin';
import AddProducts from './pages/Admin/AddProducts';
import UpdateProducts from './pages/Admin/UpdateProducts';
import AllProducts from './pages/Admin/AllProducts';
import AllUsers from './pages/Admin/AllUsers';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Home/>} />
          <Route exact path='/signup' element={<SignUp/>} />
          <Route exact path='/allproducts' element={<AllProducts/>} />
          <Route exact path='/admin' element={<Admin/>} />
          <Route exact path='/allusers' element={<AllUsers/>} />
          <Route exact path='/addProduct' element={<AddProducts/>} />
          <Route exact path='/updateProducts' element={<UpdateProducts/>} />
          <Route exact path='/login' element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
