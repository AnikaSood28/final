import React, { useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCollection } from "../../redux/features/products/productThunk";
import { resetProducts } from "../../redux/features/products/productSlice";
import { FaHeart } from "react-icons/fa";
import useWishlist from "../../hooks/useWishlist"; // ✅ Use the custom hook
import Loader from "../../components/loader/Loader";
import styles from "./Collections.module.scss";

const Collections = () => {
  const dispatch = useDispatch();
  const { source, gender } = useParams();
  const { filteredItems: products, status, error, page, hasMore } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);

  // ✅ Use custom wishlist hook
  const { wishlistItems, handleWishlist } = useWishlist(user);

  useEffect(() => {
    dispatch(resetProducts()); // Reset before fetching new collection
    dispatch(fetchProductsByCollection({ source, gender, page: 1 }));
  }, [dispatch, source, gender]);

  const fetchNextPage = useCallback(() => {
    if (status === "loading" || !hasMore) return;
    dispatch(fetchProductsByCollection({ gender, source, page }));
  }, [status, dispatch, page, hasMore, gender, source]);

  const observer = useRef();
  const lastProductRef = useCallback((node) => {
    if (status === "loading" || !hasMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    if (node) observer.current.observe(node);
  }, [fetchNextPage]);

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return typeof price === "number"
      ? `Rs ${price.toLocaleString()}`
      : price.toString().replace("Rs.", "Rs ").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
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
      <h1 className={styles.pageTitle}>
        {source || "All"} Collection{gender ? ` - ${gender}` : ""}
      </h1>

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
                  <>
                    <img
                      src={product.image}
                      alt={product.title || "Product"}
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = "none";
                        const placeholder = e.target.parentElement.querySelector(`.${styles.imagePlaceholder}`);
                        if (placeholder) {
                          placeholder.style.display = "flex";
                        }
                      }}
                    />
                    <div className={styles.imagePlaceholder} style={{ display: "none" }}>
                      Image Not Available
                    </div>
                  </>
                ) : (
                  <div className={styles.imagePlaceholder}>Image Not Available</div>
                )}

                {/* ✅ Wishlist Button Using Hook */}
                <button
                  className={styles.wishlistButton}
                  onClick={() => handleWishlist(product._id)}
                  aria-label={
                    wishlistItems.some((item) => item._id === product._id) ? "Remove from wishlist" : "Add to wishlist"
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
                <p className={styles.productPrice}>
  {product.salePrice && product.salePrice !== "N/A" ? (
    <>
      <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
      <span className={styles.salePrice}>{formatPrice(product.salePrice)}</span>
    </>
  ) : (
    formatPrice(product.price)
  )}
</p>

                <div className={styles.productActions}>
                  <a href={product.link} className={styles.productLink} target="_blank" rel="noopener noreferrer">
                    View Product
                  </a>
                </div>
              </div>
            </article>
          ))}
      </div>

      {status === "loading" && page > 1 && <p>Loading more products...</p>}
      {error && (
        <p className={styles.error}>
          {typeof error === "object" ? error.message || "An error occurred" : error}
        </p>
      )}
    </div>
  );
};

export default Collections;
