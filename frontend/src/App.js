import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/profile/Profile";
import Collections from "./pages/collections/Collections";
import Wishlist from "./pages/wishlist/Wishlist";
import { getLoginStatus } from "./redux/features/auth/authSlice";
import MenCollection from "./pages/men/menspage";

const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // ✅ Now inside BrowserRouter
  const navigate = useNavigate(); // ✅ Now inside BrowserRouter

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  // Save last visited page
  useEffect(() => {
    localStorage.setItem("lastVisitedPage", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    console.log("Saving last visited page:", location.pathname); // ✅ Debugging log
    if (location.pathname !== "/") {
      localStorage.setItem("lastVisitedPage", location.pathname);
    }
  }, [location.pathname]);
  
  return (
    <>
      <ToastContainer />
      <Header 
        openLogin={() => setLoginModalOpen(true)} 
        openRegister={() => setRegisterModalOpen(true)} 
      />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/men" element={<MenCollection />} />
      </Routes>

      <Login 
        isModalOpen={isLoginModalOpen} 
        closeModal={() => setLoginModalOpen(false)}
        openRegister={() => {
          setLoginModalOpen(false);
          setRegisterModalOpen(true);
        }}
      />

      <Register 
        isModalOpen={isRegisterModalOpen} 
        closeModal={() => setRegisterModalOpen(false)}
        openLogin={() => {
          setRegisterModalOpen(false);
          setLoginModalOpen(true);
        }}
      />

      <Footer />
    </>
  );
};

// Wrap everything in BrowserRouter
const App = () => {
  axios.defaults.withCredentials = true;

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
