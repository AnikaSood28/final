import React, { useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCollection } from "../../redux/features/products/productThunk";
import { resetProducts ,setSort} from "../../redux/features/products/productSlice";
import { FaHeart } from "react-icons/fa";
import useWishlist from "../../hooks/useWishlist";
import Loader from "../../components/loader/Loader";
import styles from "../collections/Collections.module.scss";

const categoryMapping = {
  "bottoms": "Bottoms",
  "dresses": "Dresses",
  "swimwear": "Swimwear",
  "accessories": "Accessories",
  "tops": "Tops",
  "playsuits": "Playsuits",
  "co-ord-set": "Co-Ord Set",
  "sweatshirts": "Sweatshirts",
  "parachute-pants": "Parachute Pants",
  "tshirts": "T-shirts",
  "shirts": "Shirts",
  "trousers": "Trousers",
  "jeans": "Jeans",
  "hoodies&sweatshirts": "Hoodies & Sweatshirts",
  "shorts": "Shorts",
  "bodysuits": "Bodysuits",
  "denim": "Denim",
  "skirts": "Skirts",
  "bralette":"Bralettes",
};

const getCategoryName = (category) => {
  return categoryMapping[category.toLowerCase()] || category;
};

const LadiesCategoryCollections = () => {
  const dispatch = useDispatch();
  const { category } = useParams();
  const formattedCategory = getCategoryName(category);
  const gender = "women";
  const { filteredItems: products, status, error, page, hasMore,sort } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);
  
  const { wishlistItems, handleWishlist } = useWishlist(user);

  useEffect(() => {
    dispatch(resetProducts());
    dispatch(fetchProductsByCollection({ gender, category: formattedCategory, page:1,sort }));

  }, [dispatch, formattedCategory, gender,sort]);

  const fetchNextPage = useCallback(() => {
    if (status === "loading" || !hasMore) return;
    dispatch(fetchProductsByCollection({ gender, category: formattedCategory, page,sort }));
  }, [status, dispatch, page, hasMore, gender, formattedCategory,sort]);
const handleSortChange = (e) => {
    dispatch(setSort(e.target.value));
  };
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

  // const formatPrice = (price) => {
  //   if (!price) return "N/A";
  //   return typeof price === "number"
  //     ? `Rs ${price.toLocaleString()}`
  //     : price.toString().replace("Rs.", "Rs ").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  // };

  if (status === "loading" && page === 1) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error.message || "An error occurred"}</div>;
  }

   return (
      <div className={styles.collectionsPage}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>
            {formattedCategory || "All"} Collection - {gender}
          </h1>
          
          <div className={styles.sortContainer}>
            <span className={styles.sortLabel}>Sort By:</span>
            <select className={styles.sortDropdown} value={sort} onChange={handleSortChange}>
              <option value="newest">Newest</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
            </select>
          </div>
        </div>
  
        <div className={styles.productsGrid}>
          {Array.isArray(products) &&
            products.map((product, index) => (
              <article className={styles.productCard} key={product._id} ref={index === products.length - 1 ? lastProductRef : null}>
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
  
                  <button
                    className={styles.wishlistButton}
                    onClick={() => handleWishlist(product._id)}
                    aria-label={wishlistItems.some((item) => item._id === product._id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <FaHeart
                      className={`${styles.heartIcon} ${wishlistItems.some((item) => item._id === product._id) ? styles.wishlisted : ""}`}
                    />
                  </button>
                </div>
  
                <div className={styles.productInfo}>
                  <h2 className={styles.productTitle}>{product.title || "Untitled Product"}</h2>
                  <p className={styles.productSource}>{product.source || "Unknown Source"}</p>
                  <p className={styles.productPrice}>
                    {product.salePrice && product.salePrice !== "N/A" ? (
                      <>
                        <span className={styles.originalPrice}>{product.price}</span>
                        <span className={styles.salePrice}>{product.salePrice}</span>
                      </>
                    ) : (
                     product.price
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
        {error && <p className={styles.error}>{typeof error === "object" ? error.message || "An error occurred" : error}</p>}
      </div>
    );
  };

export default LadiesCategoryCollections;
