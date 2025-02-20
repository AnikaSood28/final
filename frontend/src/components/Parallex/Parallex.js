import { useEffect, useState } from 'react';
import styles from './Parallex.module.scss';
//import dummy from '../../assets/dummy.jpg';
const ParallaxSection = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles['parallax-container']}>
      <div className={styles['sticky-container']}>
        <div className={styles['parallax-section']}>
          {/* Left Section */}
          <div className={styles['image-container']}>
            <img 
              src="https://media.cnn.com/api/v1/images/stellar/prod/230322120306-01-lotw-0322-louis-hamilton-fashion-grand-prix-rick-owens.jpg?q=w_2000,c_fill/f_webp"
              alt="Product Image"
              className={styles['parallax-image']}
              style={{
                transform: `translateY(${scrollPosition * 0.1}px)`
              }}
            />
          </div>

          {/* Right Section */}
          <div className={styles['content-container']}>
            <div 
              className={`${styles['content-wrapper']} ${styles['fade-in']}`}
              style={{
                transform: `translateY(${scrollPosition * -0.2}px)`
              }}
            >
              <h2 className={styles['product-title']}>
                Men's Collection
              </h2>
              <p className={styles['product-description']}>
               Shop now ...
              </p>
              
            </div>
          </div>
        </div>
      </div>
    </div>

    
  );
};

export default ParallaxSection;