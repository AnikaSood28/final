import React, { useState, useEffect } from "react";
import styles from "./Header.module.scss";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTimes, FaUserCircle, FaHeart } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { RESET_AUTH, logout } from "../../redux/features/auth/authSlice";
import ShowOnLogin, { ShowOnLogout } from "../hiddenLink/hiddenLink";
import { UserName } from "../../pages/profile/Profile";
import DropdownMenu from "../Dropdown/Dropdown";
import Login from "../../pages/auth/Login";
import Register from "../../pages/auth/Register";
import { SearchBar } from "../search/Search";

export const logo = (
  <div className={styles.logo}>
    <Link to="/">
      <h2>Shop<span>Ito</span>.</h2>
    </Link>
  </div>
);

const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : "");

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [scrollPage, setScrollPage] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fixNavbar = () => {
      if (window.scrollY > 50) {
        setScrollPage(true);
      } else {
        setScrollPage(false);
      }
    };
    
    window.addEventListener("scroll", fixNavbar);
    return () => window.removeEventListener("scroll", fixNavbar);
  }, []);

  const toggleMenu = () => setShowMenu(!showMenu);
  const hideMenu = () => setShowMenu(false);

  const logoutUser = async () => {
    await dispatch(logout());
    await dispatch(RESET_AUTH());
    navigate("/");
  };

  // const cart = (
  //   <span className={styles.cart}>
  //     <Link to={"/cart"}>
  //       Cart <FaShoppingCart size={20} />
  //       <p>0</p>
  //     </Link>
  //   </span>
  // );

  return (
    <header className={scrollPage ? `${styles.fixed}` : null}>
      <div className={styles.header}>
        {logo}
        <nav className={showMenu ? `${styles["show-nav"]}` : `${styles["hide-nav"]}`}>
          <div
            className={showMenu ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}` : `${styles["nav-wrapper"]}`}
            onClick={hideMenu}
          ></div>

          <ul>
            <li className={styles["logo-mobile"]}>
              {logo}
              <FaTimes size={22} color="#fff" onClick={hideMenu} />
            </li>
            {/* <li>
              <NavLink to="/shop" className={activeLink}>
                Shop
              </NavLink>
            </li> */}
            {/* <ShowOnLogin>
              <li>
                <NavLink to="/wishlist" className={activeLink}>
                  Wishlist
                </NavLink>
              </li>
            </ShowOnLogin> */}
          </ul>

          <div className={styles["header-right"]}>
            <span className={styles.links}>
              <ShowOnLogin>
                <NavLink to="/profile" className={activeLink}>
                  <FaUserCircle size={16} color="#ff7722" />
                  <UserName />
                </NavLink>
              </ShowOnLogin>

              <ShowOnLogout>
                <span className={styles.loginText} onClick={() => setLoginModalOpen(true)}>
                  Login
                </span>
              </ShowOnLogout>

              <ShowOnLogout>
                <span className={styles.registerText} onClick={() => setRegisterModalOpen(true)}>
                  Register
                </span>
              </ShowOnLogout>

              <ShowOnLogin>
                <NavLink to="/wishlist" className={`${activeLink} ${styles.wishlist}`}>
                  <FaHeart size={16} color="#ff7722" />
                  Wishlist
                </NavLink>
              </ShowOnLogin>

              <ShowOnLogin>
                <NavLink to="/order-history" className={activeLink}>
                  My Orders
                </NavLink>
              </ShowOnLogin>

              <ShowOnLogin>
                <Link to="/" onClick={logoutUser}>
                  Logout
                </Link>
              </ShowOnLogin>
            </span>
            {/* {cart} */}
          </div>
          <SearchBar/>
        </nav>

        <div className={styles["menu-icon"]}>
          {/* {cart} */}
          <HiOutlineMenuAlt3 size={28} onClick={toggleMenu} />
        </div>
      </div>

      <div className={styles.categories}>
        <DropdownMenu />
      </div>

      {isLoginModalOpen && (
        <Login 
          isModalOpen={isLoginModalOpen} 
          closeModal={() => setLoginModalOpen(false)}
          openRegister={() => {
            setLoginModalOpen(false);
            setRegisterModalOpen(true);
          }}
        />
      )}

      {isRegisterModalOpen && (
        <Register 
          isModalOpen={isRegisterModalOpen} 
          closeModal={() => setRegisterModalOpen(false)}
          openLogin={() => {
            setRegisterModalOpen(false);
            setLoginModalOpen(true);
          }}
        />
      )}
    </header>
  );
};

export default Header;