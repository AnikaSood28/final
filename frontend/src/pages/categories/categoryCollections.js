import React, { useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCollection } from "../../redux/features/products/productThunk";
import { resetProducts } from "../../redux/features/products/productSlice";
import { FaHeart } from "react-icons/fa";
import useWishlist from "../../hooks/useWishlist";
import Loader from "../../components/loader/Loader";
import styles from "../collections/Collections.module.scss";

const categoryMapping = {
  "tshirts": "T-shirts",
  "jeans": "Jeans",
  "jackets": "Jackets",
  "shirts": "Shirts",
  "bottoms": "Bottoms",
  "sweatpants": "SweatPants",
  "sweatshirts": "Sweatshirts",
  "accessories": "Accessories",
  "sweaters": "Sweaters",
  "polos":"Polos",
  "hoodies&sweatshirts": "Hoodies & Sweatshirts",
  "denim": "Denim",
  "hoodies":"Hoodies",
  "jersey": "Jersey"
};

const getCategoryName = (category) => {
  return categoryMapping[category.toLowerCase()] || category;
};

const CategoryCollections = () => {
  const dispatch = useDispatch();
  const { category } = useParams();
  const formattedCategory = getCategoryName(category);
  const gender = "men";
  const { filteredItems: products, status, error, page, hasMore } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);
  
  const { wishlistItems, handleWishlist } = useWishlist(user);

  useEffect(() => {
    dispatch(resetProducts());
    dispatch(fetchProductsByCollection({ gender, category: formattedCategory, page:1 }));

  }, [dispatch, formattedCategory, gender]);

  const fetchNextPage = useCallback(() => {
    if (status === "loading" || !hasMore) return;
    dispatch(fetchProductsByCollection({ gender, category: formattedCategory, page }));
  }, [status, dispatch, page, hasMore, gender, formattedCategory]);

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
    return <div className={styles.error}>{error.message || "An error occurred"}</div>;
  }

  return (
    <div className={styles.collectionsPage}>
      <h1 className={styles.pageTitle}>
        {formattedCategory || "All"} Collection - {gender}
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
  srcSet={`
    ${product.image}?w=300 300w,
    ${product.image}?w=600 600w,
    ${product.image}?w=1200 1200w
  `}
  sizes="(max-width: 600px) 300px, (max-width: 1200px) 600px, 1200px"
  alt={product.title || "Product"}
  loading="lazy"
/>

                    <div className={styles.imagePlaceholder} style={{ display: "none" }}>
                      Image Not Available
                    </div>
                  </>
                ) : (
                  <div className={styles.imagePlaceholder}>Image Not Available</div>
                )}

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
                <p className={styles.productSource}>{product.source || "Unknown Source"}</p>
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
      {error && <p className={styles.error}>{error.message || "An error occurred"}</p>}
    </div>
  );
};

export default CategoryCollections;
