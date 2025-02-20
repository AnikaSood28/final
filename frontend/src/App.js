import { BrowserRouter, Route, Routes } from "react-router-dom";
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

import { getLoginStatus } from "./redux/features/auth/authSlice";

const App = () => {
  axios.defaults.withCredentials = true;
  const dispatch = useDispatch();
  
  // State to control login and register modal visibility
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Header 
          openLogin={() => setLoginModalOpen(true)} 
          openRegister={() => setRegisterModalOpen(true)} 
        />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

        {/* Login Modal */}
        <Login 
          isModalOpen={isLoginModalOpen} 
          closeModal={() => setLoginModalOpen(false)}
          openRegister={() => {
            setLoginModalOpen(false);
            setRegisterModalOpen(true);
          }}
        />

        {/* Register Modal */}
        <Register 
          isModalOpen={isRegisterModalOpen} 
          closeModal={() => setRegisterModalOpen(false)}
          openLogin={() => {
            setRegisterModalOpen(false);
            setLoginModalOpen(true);
          }}
        />

        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;