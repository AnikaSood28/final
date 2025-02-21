import React, { useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCollection } from "../../redux/features/products/productSlice";
import styles from "./Collections.module.scss";

const Collections = () => {
  const dispatch = useDispatch();
  const { source, gender } = useParams();
  const { filteredItems: products, status, error, page, hasMore } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProductsByCollection({ source, gender, page }));
  }, [dispatch, source, gender]);

  const observer = useRef();
  const lastProductRef = useCallback(
    (node) => {
      if (status === "loading" || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          dispatch(fetchProductsByCollection({ source, gender, page }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [status, dispatch, source, gender, page, hasMore]
  );

  const formatPrice = (price) => {
    if (!price) return "N/A";
  
    // Check if price already includes "Rs" to avoid duplicate formatting
    if (typeof price === "string" && price.includes("Rs")) {
      return price; // Return as is to avoid Rs Rs issue
    }
  
    // Ensure numeric format and apply formatting
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) return "N/A"; // If not a number, return "N/A"
  
    return `Rs ${numericPrice.toLocaleString()}`;
  };
  

  return (
    <div className={styles.collectionsPage}>
      <h1 className={styles.pageTitle}>
        {source || "All"} Collection{gender ? ` - ${gender}` : ""}
      </h1>

      <div className={styles.productsGrid}>
        {products.map((product, index) => (
          <article
            className={styles.productCard}
            key={product._id}
            ref={index === products.length - 1 ? lastProductRef : null}
          >
            <div className={styles.productImage}>
              <img src={product.image} alt={product.title} loading="lazy" />
            </div>
            <div className={styles.productInfo}>
              <h2>{product.title}</h2>
              <p>{product.source}</p>
              <p>{formatPrice(product.price)}</p>
              <a href={product.link} target="_blank" rel="noopener noreferrer">
                View Product
              </a>
            </div>
          </article>
        ))}
      </div>

      {status === "loading" && <p>Loading more products...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}
    </div>
  );
};

export default Collections;
