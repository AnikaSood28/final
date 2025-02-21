import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Collections.module.scss';

const BACKEND_URL = 'http://localhost:5000'; // Update this to match your backend URL

const Collections = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { source, gender } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${BACKEND_URL}/api/products`;
        if (source && gender) {
          url = `${BACKEND_URL}/api/products/source/gender/${source}/${gender}`;
        } else if (source) {
          url = `${BACKEND_URL}/api/products/source/${source}`;
        } else if (gender) {
          url = `${BACKEND_URL}/api/products/gender/${gender}`;
        }

        const response = await axios.get(url);
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [source, gender]);

  const formatPrice = (price) => {
    if (!price) return 'N/A'; // Handle null or undefined prices
    if (typeof price === 'number') {
      return `Rs ${price.toLocaleString()}`;
    }
    return price.toString().replace('Rs.', 'Rs ').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading products...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.collectionsPage}>
      <h1 className={styles.pageTitle}>
        {source || 'All'} Collection{gender ? ` - ${gender}` : ''}
      </h1>
      
      <div className={styles.productsGrid}>
        {products.map((product) => (
          <article className={styles.productCard} key={product._id}>
            <div className={styles.productImage}>
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.title} 
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
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
              <a 
                href={product.link} 
                className={styles.productLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Product
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Collections;