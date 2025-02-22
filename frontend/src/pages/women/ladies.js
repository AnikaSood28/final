import React, { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCollection } from "../../redux/features/products/productThunk";
import { resetProducts } from "../../redux/features/products/productSlice";
import { FaHeart } from "react-icons/fa";
import Loader from "../../components/loader/Loader";
import useWishlist from "../../hooks/useWishlist"; // ✅ Use Wishlist Hook
import styles from "../collections/Collections.module.scss";

const LadiesCollection = () => {
  const dispatch = useDispatch();
  const { filteredItems: products = [], status, error, page, hasMore } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);
  const { wishlistItems, handleWishlist } = useWishlist(user); // ✅ Use Wishlist Hook

  // Reset products and fetch first page on mount
  useEffect(() => {
    dispatch(resetProducts()); 
    dispatch(fetchProductsByCollection({ gender: "women", page: 1 }));
  }, [dispatch]);

  // Infinite Scroll Observer
  const observer = useRef();
  const lastProductRef = useCallback(
    (node) => {
      if (status === "loading" || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          dispatch(fetchProductsByCollection({ gender: "women", page })); // Fetch next page
        }
      });

      if (node) observer.current.observe(node);
    },
    [status, dispatch, page, hasMore]
  );

  const formatPrice = (price) => {
    if (!price) return "N/A";
    const priceString = typeof price === "number" ? price.toString() : price;
    let cleanPrice = priceString.replace(/Rs\.?/gi, "").trim();
    let formattedPrice = cleanPrice.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    return `Rs ${formattedPrice}`;
  };

  if (status === "loading" && page === 1) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className={styles.error}>
        {typeof error === "object" ? error.message || "An error occurred" : error}
      </div>
    );
  }

  return (
    <div className={styles.collectionsPage}>
      <h1 className={styles.pageTitle}>Ladies's Collection</h1>
      <div className={styles.productsGrid}>
        {Array.isArray(products) &&
          products.map((product, index) => (
            <article
              className={styles.productCard}
              key={product._id}
              ref={index === products.length - 1 ? lastProductRef : null}
            >
              <div className={styles.productImage}>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title || "Product"}
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>Image Not Available</div>
                )}
                <button
                  className={styles.wishlistButton}
                  onClick={() => handleWishlist(product._id)}
                  aria-label={
                    wishlistItems.some((item) => item._id === product._id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <FaHeart
                    className={`${styles.heartIcon} ${
                      wishlistItems.some((item) => item._id === product._id) ? styles.wishlisted : ""
                    }`}
                  />
                </button>
              </div>
              <div className={styles.productInfo}>
                <h2 className={styles.productTitle}>{product.title || "Untitled Product"}</h2>
                <p className={styles.productSource}>{product.source || "Unknown Source"}</p>
                <p className={styles.productPrice}>{formatPrice(product.price)}</p>
                <a href={product.link} className={styles.productLink} target="_blank" rel="noopener noreferrer">
                  View Product
                </a>
              </div>
            </article>
          ))}
      </div>
      {status === "loading" && page > 1 && <p>Loading more products...</p>}
    </div>
  );
};

export default LadiesCollection;
