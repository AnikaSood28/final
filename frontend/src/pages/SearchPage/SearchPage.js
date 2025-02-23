import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import styles from './SearchPage.module.scss';
import useWishlist from '../../hooks/useWishlist'; 
import { useSelector } from 'react-redux';


const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const { user } = useSelector((state) => state.auth);
  const { wishlistItems, handleWishlist } = useWishlist(user);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const observer = useRef();

  useEffect(() => {
    if (query) {
      setPage(1);
      setProducts([]); // Reset products when query changes
      searchProducts(query, 1);
    }
  }, [query]);

  const searchProducts = async (searchQuery, pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `http://localhost:5000/api/products/search?q=${encodeURIComponent(searchQuery)}&page=${pageNum}&limit=12`,
        { credentials: 'include' }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      setProducts(prev => pageNum === 1 ? data.data : [...prev, ...data.data]);
      setHasMore(data.hasMore);
      setPage(pageNum + 1);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll observer
  const lastProductRef = useCallback(node => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        searchProducts(query, page);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, query, page]);

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return typeof price === "number" 
      ? `Rs ${price.toLocaleString()}`
      : price.toString().replace("Rs.", "Rs ").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  return (
    <div className={styles.collectionsPage}>
      <h1 className={styles.pageTitle}>
        Search Results for "{query}"
      </h1>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.productsGrid}>
        {products.map((product, index) => (
          <div 
            key={product._id}
            className={styles.productCard}
            ref={index === products.length - 1 ? lastProductRef : null}
          >
            <div className={styles.productImage}>
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const placeholder = e.target.parentElement.querySelector(`.${styles.imagePlaceholder}`);
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  Image not available
                </div>
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
                <Heart className={
                  wishlistItems.some((item) => item._id === product._id)
                    ? styles.wishlisted
                    : ""
                } />
              </button>
            </div>
            
            <div className={styles.productInfo}>
              <h3 className={styles.productTitle}>{product.title}</h3>
              <p className={styles.productSource}>{product.source}</p>
              <p className={styles.productPrice}>{formatPrice(product.price)}</p>
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.productLink}
              >
                View Product
              </a>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}

      {!loading && products.length === 0 && query && (
        <div className={styles.error}>
          No products found for "{query}"
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;