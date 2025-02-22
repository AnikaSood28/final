import React, { useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCollection } from "../../redux/features/products/productThunk";
import { resetProducts } from "../../redux/features/products/productSlice";
import { FaHeart } from "react-icons/fa";
import useWishlist from "../../hooks/useWishlist";
import Loader from "../../components/loader/Loader";
import styles from "../collections/Collections.module.scss";

// ✅ Mapping UI names to database names
const brandNameMapping = {
  "Jaywalking": "Jaywalking",
  "Veloce": "Veloce",
  "H&M": "H&M",
  "Huemn": "HUEMN",
  "Almost Gods": "Almost Gods",
  "TurntUp": "TURNT",
  "Outcasts": "outcasts",
  "BluOrng": "BluOrng",
  "Space Biskit": "SpaceBiskit",
  "WtFlex": "wtflex",
  "Six5Six": "six5sixstreet",
  "Drip Project": "Drip Project",
  "Crayyheads": "Crayyheads",
  "Bomaachi":"Bomaachi",
  "Blck Orchid": "Blck Orchid",
  "Future Saints": "Future Saints",
  "Warping Theories": "Warping Theories"
};

const getDatabaseName = (slug) => {
    if (!slug) return "";
  
    let decodedSlug = decodeURIComponent(slug);
    console.log("Original Slug:", slug);
    console.log("Decoded Slug:", decodedSlug);
  
    // ✅ Special case for "H&M" handling
    if (decodedSlug.toLowerCase() === "hm" || decodedSlug.toLowerCase() === "h&m") {
      console.log("Matched H&M manually");
      return "H&M";
    }
  
    // ✅ Direct match before formatting
    if (brandNameMapping[decodedSlug]) {
      console.log("Matched Directly in brandNameMapping:", brandNameMapping[decodedSlug]);
      return brandNameMapping[decodedSlug];
    }
  
    // ✅ Convert camelCase or PascalCase to spaced words
    const spacedName = decodedSlug.replace(/([a-z])([A-Z])/g, "$1 $2");
  
    // ✅ Capitalize first letter of each word
    const formattedName = spacedName
      .replace(/-/g, " ") // Convert hyphens to spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize each word
      .trim();
  
    console.log("Formatted Name:", formattedName);
  
    const finalName = brandNameMapping[formattedName] || formattedName;
    console.log("Final Database Name:", finalName);
  
    return finalName;
  };
  
  
const BrandCollections = () => {
  const dispatch = useDispatch();
  const { source, gender } = useParams();
  const databaseName = getDatabaseName(source); // Convert to DB name
  const { filteredItems: products, status, error, page, hasMore } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);

  // ✅ Use custom wishlist hook
  const { wishlistItems, handleWishlist } = useWishlist(user);

  useEffect(() => {
    dispatch(resetProducts()); // Reset before fetching new collection
    dispatch(fetchProductsByCollection({ source: databaseName, gender, page: 1 }));
  }, [dispatch, databaseName, gender]);

  const fetchNextPage = useCallback(() => {
    if (status === "loading" || !hasMore) return;
    dispatch(fetchProductsByCollection({ gender, source: databaseName, page }));
  }, [status, dispatch, page, hasMore, gender, databaseName]);

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
        {databaseName || "All"} Collection{gender ? ` - ${gender}` : ""}
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
                <p className={styles.productSource}>{product.source || "Unknown Source"}</p>
                <p className={styles.productPrice}>{formatPrice(product.price)}</p>
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

export default BrandCollections;
