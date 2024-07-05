import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Navigation from "./components/Navigation/Navigation";
import Footer from "./components/Footer/Footer";
import SignIn from "./components/general/SignIn";
import Introduction from "./components/general/Introduction";
import Promotion from "./components/general/Promotion";
import SignUp from "./components/general/SignUp";
import HomePage from "./components/general/HomePage";
import Cart from "./components/general/Cart";
import Profile from "./components/general/Profile";
import CategorieManagement from "./components/admin/CategorieManagement";
import BrandManagement from "./components/admin/BrandManagement";
import AgeManagement from "./components/admin/AgeManagement";
import Products from "./components/general/Products";
import ProtectedRoute from "./components/gateway/ProtectedRoute";
import StaffHome from "./components/staff/StaffHome";
import AdminHome from "./components/admin/AdminHome";
import Stores from "./components/general/Stores";
import StoreDetail from "./components/general/StoreDetail";
import ProductDetails from "./components/general/ProductDetails";
import Article from "./components/general/Article";
import ArticleDetails from "./components/general/ArticleDetails";
import StaffLayout from "./components/staff/StaffLayout";
import AdminLayout from "./components/admin/AdminLayout";
import RegisStores from "./components/general/RegisStores";
import Orders from "./components/general/Orders";
import Articles from "./components/staff/ArticlesManagement";
import VoucherManagement from "./components/staff/VoucherManagement";
import RequestStore from "./components/admin/RequestStore";
import StoreManagement from "./components/admin/StoreManagement";
import AccountManagement from "./components/admin/AccountManagement";
import OrdersManagement from "./components/staff/OrdersManagement";
import ExchangesManagement from "./components/staff/ExchangesManagement";
import RefundManagement from "./components/staff/RefundManagement";
import ProductDetailsManagement from "./components/staff/ProductDetailsManagement";
import CommentHistory from "./components/general/CommentHistory";
import ProductGiftDetails from "./components/general/ProductGiftDetails";
import ProductGift from "./components/general/ProductGift";
import Requests from "./components/general/Requests";
import Dashboard from "./components/staff/Dashboard";
import SuccessPayment from "./components/general/SuccessPayment";
import FailedPayment from "./components/general/FailedPayment";

const applyScrollbarStyles = () => {
  const style = document.createElement("style");
  style.innerHTML = `
    ::-webkit-scrollbar {
      width: 0.7rem;
    }

    ::-webkit-scrollbar-track {
      background: #f5f7fd;
    }

    ::-webkit-scrollbar-thumb {
      background-color: #ff469e;
      border-radius: 0.6rem;
      border: 2px solid #f5f7fd;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #ffbbd0;
    }
  `;
  document.head.appendChild(style);
};

function App() {
  useEffect(() => {
    applyScrollbarStyles();
  }, []);

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
        <Route path="/productgift" element={<ProductGift />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route
          path="/productgiftdetail/:productId"
          element={<ProductGiftDetails />}
        />
        <Route path="/article/:articleId" element={<ArticleDetails />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/stores/:store_id" element={<StoreDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/successPayment" element={<SuccessPayment />} />
        <Route path="/failedPayment" element={<FailedPayment />} />
        <Route path="/history/comment" element={<CommentHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/regisstore" element={<RegisStores />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/articles" element={<Article />} />
        <Route path="/stores/:article_id" element={<Article />} />
        <Route path="/requests" element={<Requests />} />
        <Route element={<ProtectedRoute allowedRole={"STAFF"} />}>
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<Navigate to={"/staff/products"} />} />
            <Route
              path="products/:productId"
              element={<ProductDetailsManagement />}
            />
            <Route path="profile" element={<Profile />} />
            <Route path="products" element={<StaffHome />} />
            <Route path="exchanges" element={<ExchangesManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="articles" element={<Articles />} />
            <Route path="vouchers" element={<VoucherManagement />} />
            <Route path="refunds" element={<RefundManagement />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRole={"ADMIN"} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to={"/admin/dashboard"} />} />
            <Route path="profile" element={<Profile />} />
            <Route path="dashboard" element={<AdminHome />} />
            <Route path="categories" element={<CategorieManagement />} />
            <Route path="brands" element={<BrandManagement />} />
            <Route path="age" element={<AgeManagement />} />
            <Route path="requeststore" element={<RequestStore />} />
            <Route path="stores" element={<StoreManagement />} />
            <Route path="accounts" element={<AccountManagement />} />
          </Route>
        </Route>
      </Routes>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
