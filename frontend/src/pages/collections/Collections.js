import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./Collections.module.scss";

const BACKEND_URL = "http://localhost:5000";

const Collections = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { source, gender } = useParams();

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1);
  }, [source, gender]);

  const fetchProducts = async (pageNum) => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      let url = `${BACKEND_URL}/api/products?page=${pageNum}&limit=10`;
      if (source && gender) {
        url = `${BACKEND_URL}/api/products/source/gender/${source}/${gender}?page=${pageNum}&limit=10`;
      } else if (source) {
        url = `${BACKEND_URL}/api/products/source/${source}?page=${pageNum}&limit=10`;
      } else if (gender) {
        url = `${BACKEND_URL}/api/products/gender/${gender}?page=${pageNum}&limit=10`;
      }

      const { data } = await axios.get(url);
      setProducts((prev) => [...prev, ...data.products]);
      setHasMore(data.hasMore);
      setPage(pageNum + 1);
    } catch (err) {
      console.error("Error fetching products:", err);
      setHasMore(false);
    }
    setIsLoading(false);
  };

  const observer = useRef();
  const lastProductRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchProducts(page);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, page]
  );

  const formatPrice = (price) => {
    if (!price) return "N/A";
    if (typeof price === "number") {
      return `Rs ${price.toLocaleString()}`;
    }
    return price.toString().replace("Rs.", "Rs ").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
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

      {isLoading && <p>Loading more products...</p>}
    </div>
  );
};

export default Collections;
