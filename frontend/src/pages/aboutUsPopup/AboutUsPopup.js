import React, { useState, useEffect } from 'react';
import styles from './Popup.module.scss';

const AboutUsPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenPopup');
    if (!hasSeenPopup) {
      setShowPopup(true);
      sessionStorage.setItem('hasSeenPopup', 'true');
    }
  }, []);

  const closePopup = () => setShowPopup(false);

  if (!showPopup) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.popupHeader}>
          <h2>About ShopIto</h2>
          <button onClick={closePopup} className={styles.closeButton}>
            &times;
          </button>
        </div>

        <div className={styles.popupContent}>
          <p className={styles.intro}>Welcome to ShopIto, your premier destination for fashion and lifestyle products.</p>
          
          <div className={styles.section}>
            <h3>Our Story</h3>
            <p>Founded in 2023, we've been dedicated to providing high-quality, curated fashion items that combine style with comfort. Our journey began with a small team of fashion enthusiasts and has grown into a trusted platform for thousands of customers.</p>
          </div>

          <div className={styles.section}>
            <h3>Our Promise</h3>
            <ul className={styles.promiseList}>
              <li>✅ Premium quality assurance</li>
              <li>✅ Ethical sourcing practices</li>
              <li>✅ Customer-first approach</li>
              <li>✅ Fast & reliable delivery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPopup;