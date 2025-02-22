import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaHeart, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import styles from './Wishlist.module.scss';
import Loader from '../../components/loader/Loader';

const BACKEND_URL = 'http://localhost:5000';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      if (!user?._id) return;
      
      try {
        const response = await axios.get(`${BACKEND_URL}/api/wishlist/${user._id}`);
        setWishlistItems(response.data.items || []);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, [user]);

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/wishlist/remove`, {
        data: { userId: user._id, productId }
      });
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    if (typeof price === 'number') {
      return `Rs ${price.toLocaleString()}`;
    }
    return price.toString().replace('Rs.', 'Rs ').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className={styles.wishlistPage}>
        <div className={styles.emptyState}>
          <h2>Please login to view your wishlist</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wishlistPage}>
      <div className={styles.wishlistHeader}>
        <FaHeart className={styles.headerIcon} />
        <h1>My Wishlist</h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>Your wishlist is empty</h2>
          <p>Save items you like by clicking the heart icon on any product</p>
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {wishlistItems.map((product) => (
            <article className={styles.productCard} key={product._id}>
              <div className={styles.productImage}>
                <button 
                  className={styles.removeButton}
                  onClick={() => removeFromWishlist(product._id)}
                  aria-label="Remove from wishlist"
                >
                  <FaTrash />
                </button>
                {product.image ? (
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
                ) : (
                  <div className={styles.imagePlaceholder}>Image Not Available</div>
                )}
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
      )}
    </div>
  );
};

export default Wishlist;