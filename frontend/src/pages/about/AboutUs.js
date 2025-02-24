import React from 'react';
import styles from './AboutUs.module.scss';

const AboutUs = () => {
  return (
    <div className={styles['about-us']}>
      <h1 className={styles['page-title']}>About Our Company</h1>
      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles['section-title']}>Our Story</h2>
          <p className={styles['section-text']}>
            Founded in 2023, we've been dedicated to providing high-quality products...
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles['section-title']}>Our Mission</h2>
          <p className={styles['section-text']}>
            To deliver exceptional shopping experiences while maintaining sustainable practices...
          </p>
        </div>

        <div className={styles.section}>
          <h2 className={styles['section-title']}>Our Commitments</h2>
          <ul className={styles['commitment-list']}>
            <li>Quality products at competitive prices</li>
            <li>Exceptional customer service</li>
            <li>Sustainable business practices</li>
            <li>Community engagement</li>
          </ul>
        </div>

       
      </div>
    </div>
  );
};

export default AboutUs;