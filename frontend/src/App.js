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
import MenCollection from "./pages/men/menspage";
import LadiesCollection from "./pages/women/ladies";
// ✅ Ensure this is included
import BrandCollections from "./pages/brands/brandsCollection";
import DropdownMenu from "./components/Dropdown/Dropdown";
import CategoryCollections from "./pages/categories/categoryCollections";
import LadiesCategoryCollections from "./pages/categories/ladiesCollections";
import SalePage from "./pages/sales/salesPage";
import SearchResultsPage from "./pages/SearchPage/SearchPage";
import AboutUs from "./pages/about/AboutUs";
import AboutUsPopup from "./pages/aboutUsPopup/AboutUsPopup";

const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  // Save last visited page
  useEffect(() => {
    localStorage.setItem("lastVisitedPage", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    console.log("Saving last visited page:", location.pathname);
    if (location.pathname !== "/") {
      localStorage.setItem("lastVisitedPage", location.pathname);
    }
  }, [location.pathname]);

  return (
    <>
    
      <ToastContainer />
      <AboutUsPopup />
      <Header 
        openLogin={() => setLoginModalOpen(true)} 
        openRegister={() => setRegisterModalOpen(true)} 
      />

   

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:source" element={<BrandCollections />} /> {/* ✅ Fix dynamic collections route */}
        <Route path="/men/:category" element={<CategoryCollections />} />
        <Route path="/women/:category" element={<LadiesCategoryCollections />} />
        <Route path="/sale/:gender/:category" element={<SalePage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/ladies" element={<LadiesCollection />} />
        <Route path="/men" element={<MenCollection />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/about-us" element={<AboutUs />} />
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
