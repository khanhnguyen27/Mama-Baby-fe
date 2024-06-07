import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/Footer/Footer";
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import SignIn from "./components/general/SignIn";
import Introduction from "./components/general/Introduction";
import Promotion from "./components/general/Promotion";
import SignUp from "./components/general/SignUp";
import HomePage from "./components/general/HomePage";
import Cart from "./components/general/Cart";
import Profile from "./components/general/Profile";
import Products from "./components/general/Products";
import ProtectedRoute from "./components/gateway/ProtectedRoute";
import StaffHome from "./components/staff/StaffHome";
import AdminHome from "./components/admin/AdminHome";
import Stores from "./components/general/Stores";
import StoreDetail from "./components/general/StoreDetail";
import ProductDetails from "./components/general/ProductDetails";
import Article from "./components/general/Article";
import StaffLayout from "./components/staff/StaffLayout";
import AdminLayout from "./components/admin/AdminLayout";

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/introduction" element={<Introduction />} />
        <Route path="/promotion" element={<Promotion />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/stores/:store_id" element={<StoreDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/article" element={<Article />} />
        <Route path="/stores/:article_id" element={<Article />} />
        <Route element={<ProtectedRoute allowedRole={"STAFF"} />}>
          <Route path="/staff" element={<StaffLayout />} >
            <Route index element={<StaffHome />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRole={"ADMIN"} />}>
        <Route path="/admin" element={<AdminLayout />} >
            <Route index element={<AdminHome />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
      <Footer />
    </div>
  );
}

export default App;
