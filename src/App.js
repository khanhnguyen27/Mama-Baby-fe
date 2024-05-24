import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import SignIn from './components/general/SignIn';
import Introduction from './components/general/Introduction';
import Promotion from './components/general/Promotion';
import SignUp from './components/general/SignUp';
import HomePage from './components/general/HomePage';
import Cart from './components/general/Cart';
import Profile from './components/general/Profile';

function App() {
  return (
    <div className="App">
      <Navigation/>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/introduction' element={<Introduction />} />
        <Route path='/promotion' element={<Promotion />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
      <ToastContainer />
      <Footer/>
    </div>
  );
}

export default App;
