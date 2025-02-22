import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCollection } from "../../redux/features/products/productSlice";
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../../components/loader/Loader';
import styles from "./Collections.module.scss";

const BACKEND_URL = 'http://localhost:5000';

const Collections = () => {
  const dispatch = useDispatch();
  const { source, gender } = useParams();
  const { filteredItems: products, status, error, page, hasMore } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    dispatch(fetchProductsByCollection({ source, gender, page }));
  }, [dispatch, source, gender, page]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user?._id) {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/wishlist/${user._id}`);
          setWishlistItems(response.data.items || []);
        } catch (err) {
          console.error('Error fetching wishlist:', err);
        }
      }
    };

    fetchWishlist();
  }, [user]);

  const observer = useRef();
  const lastProductRef = useCallback(
    (node) => {
      if (status === "loading" || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          dispatch(fetchProductsByCollection({ source, gender, page: page + 1 }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [status, dispatch, source, gender, page, hasMore]
  );

  const handleWishlist = async (productId) => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      const isInWishlist = wishlistItems.some(item => item._id === productId);
      
      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`${BACKEND_URL}/api/wishlist/remove`, {
          data: { userId: user._id, productId }
        });
        setWishlistItems(wishlistItems.filter(item => item._id !== productId));
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        await axios.post(`${BACKEND_URL}/api/wishlist/add`, {
          userId: user._id,
          productId
        });
        setWishlistItems([...wishlistItems, { _id: productId }]);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error('Failed to update wishlist');
      console.error('Wishlist operation failed:', err);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    if (typeof price === 'number') {
      return `Rs ${price.toLocaleString()}`;
    }
    return price.toString().replace('Rs.', 'Rs ').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  if (status === "loading" && page === 1) {
    return <Loader />;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

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
              {product.image ? (
                <>
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const placeholder = e.target.parentElement.querySelector(`.${styles.imagePlaceholder}`);
                      if (placeholder) {
                        placeholder.style.display = 'flex';
                      }
                    }}
                  />
                  <div className={styles.imagePlaceholder} style={{ display: 'none' }}>
                    Image Not Available
                  </div>
                </>
              ) : (
                <div className={styles.imagePlaceholder}>Image Not Available</div>
              )}
              <button 
                className={styles.wishlistButton}
                onClick={() => handleWishlist(product._id)}
                aria-label={wishlistItems.some(item => item._id === product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <FaHeart 
                  className={`${styles.heartIcon} ${wishlistItems.some(item => item._id === product._id) ? styles.wishlisted : ''}`} 
                />
              </button>
            </div>
            <div className={styles.productInfo}>
              <h2 className={styles.productTitle}>{product.title}</h2>
              <p className={styles.productSource}>{product.source}</p>
              <p className={styles.productPrice}>{formatPrice(product.price)}</p>
              <div className={styles.productActions}>
                <a 
                  href={product.link} 
                  className={styles.productLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Product
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {status === "loading" && page > 1 && <p>Loading more products...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}
    </div>
  );
};

export default Collections;