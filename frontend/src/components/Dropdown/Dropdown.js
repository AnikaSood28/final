import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Dropdown.module.scss"; // Import styles

const menuItems = [
  {
    title: "All Collections",
    path: "/collections",
    subcategories: [
      { name: "Jaywalking", path: "/collections/Jaywalking" },
      { name: "Veloce", path: "/collections/Veloce" },
      { name: "H&M", path: "/collections/hm" },
      { name: "Huemn", path: "/collections/huemn" },
      { name: "Almost Gods", path: "/collections/AlmostGods" },
      { name: "TurntUp", path: "/collections/TurntUp" },
      { name: "Outcasts", path: "/collections/Outcasts" },
      { name: "BluOrng", path: "/collections/BluOrng" },
      { name: "SpaceBiskit", path: "/collections/SpaceBiskit" },
      { name: "WtFlex", path: "/collections/WtFlex" },
      { name: "Six5Six", path: "/collections/Six5Six" },
      { name: "Drip Project", path: "/collections/DripProject" },
      { name: "Crayyheads", path: "/collections/Crayyheads" },
      { name: "Bomaachi", path: "/collections/Bomaachi" },
      { name: "Blck Orchid", path: "/collections/BlckOrchid" },
      { name: "Future Saints", path: "/collections/FutureSaints" },
      { name: "Warping Theories", path: "/collections/WarpingTheories" },
    ],
  },
  {
    title: "Ladies",
    path: "/women",
    subcategories: [
      { name: "Bottoms", path: "/women/bottoms" },
      { name: "Dresses", path: "/women/dresses" },
      { name: "Swimwear", path: "/women/swimwear" },
      { name: "Accessories", path: "/women/accessories" },
      { name: "Tops", path: "/women/tops" },
      { name: "Playsuits", path: "/women/playsuits" },
      { name: "Co-Ord Set", path: "/women/co-ord-set" },
      { name: "Sweatshirts", path: "/women/sweatshirts" },
      { name: "Parachute Pants", path: "/women/parachute-pants" },
      { name: "T-shirts", path: "/women/t-shirts" },
      { name: "Shirts", path: "/women/shirts" },
      { name: "Trousers", path: "/women/trousers" },
      { name: "Jeans", path: "/women/jeans" },
      { name: "Hoodies & Sweatshirts", path: "/women/hoodies-sweatshirts" },
      { name: "Shorts", path: "/women/shorts" },
      { name: "Bodysuits", path: "/women/bodysuits" },
      { name: "Denim", path: "/women/denim" },
      { name: "Skirts", path: "/women/skirts" },
    
    ],
  },
  {
    title: "Men",
    path: "/men",
    subcategories: [
      { name: "T-shirts", path: "/men/tshirts" },
      { name: "Polos", path: "/men/polos" },
      { name: "Jeans", path: "/men/jeans" },
      { name: "Jackets", path: "/men/jackets" },
      { name: "Shirts", path: "/men/shirts" },
      { name: "Bottoms", path: "/men/bottoms" },
      { name: "SweatPants", path: "/men/sweatpants" },
      { name: "Sweatshirts", path: "/men/sweatshirts" },
      { name: "Accessories", path: "/men/accessories" },
      { name: "Hoodies", path: "/men/hoodies" },
      { name: "Denim", path: "/men/denim" },
      { name: "Jersey", path: "/men/jersey" },
    ],
  },
  {
    title: "Sale",
    subcategories: [
      {
        name: "Men",
        path: "/sale/men",
        subcategories: [
          { name: "T-shirts", path: "/sale/men/tshirts" },
          { name: "Jeans", path: "/sale/men/jeans" },
          { name: "Jackets", path: "/sale/men/jackets" },
          { name: "Shirts", path: "/sale/men/shirts" },
          { name: "Bottoms", path: "/sale/men/bottoms" },
          { name: "SweatPants", path: "/sale/men/sweatpants" },
          { name: "Sweatshirts", path: "/sale/men/sweatshirts" },
          { name: "Accessories", path: "/sale/men/accessories" },
          { name: "Hoodies", path: "/sale/men/hoodies" },
          { name: "Denim", path: "/sale/men/denim" },
          { name: "Jersey", path: "/sale/men/jersey" },
        ],
      },
      {
        name: "Women",
        path: "/sale/women",
        subcategories: [
          { name: "Bottoms", path: "/sale/women/bottoms" },
          { name: "Dresses", path: "/sale/women/dresses" },
          { name: "Swimwear", path: "/sale/women/swimwear" },
          { name: "Accessories", path: "/sale/women/accessories" },
          { name: "Tops", path: "/sale/women/tops" },
          { name: "Playsuits", path: "/sale/women/playsuits" },
          { name: "Co-Ord Set", path: "/sale/women/co-ord-set" },
          { name: "Sweatshirts", path: "/sale/women/sweatshirts" },
          { name: "T-shirts", path: "/sale/women/t-shirts" },
          { name: "Jeans", path: "/sale/women/jeans" },
       
        ],
      },
    ],
  },
];

const DropdownMenu = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const handleNavigation = (path) => {
    window.location.href = path; // Force a full page reload
  };

  const renderSubcategories = (subcategories, category) => {
    if (category === "Sale") {
      return (
        <div className={styles.dropdownContent}>
          <div className={styles.saleGrid}>
            {subcategories.map((gender, index) => (
              <div key={index} className={styles.genderSection}>
                <h3 className={styles.genderTitle}>{gender.name}</h3>
                <div className={styles.subcategoriesGrid}>
                  {gender.subcategories.map((item, idx) => (
                    <div key={idx} className={styles.subcategory} onClick={() => handleNavigation(item.path)}>
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className={styles.dropdownContent}>
        <div className={styles.subcategoriesGrid}>
          {subcategories.map((subcategory, index) => (
            <div key={index} className={styles.subcategory} onClick={() => handleNavigation(subcategory.path)}>
              {subcategory.name}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.menuContainer} onMouseLeave={() => setActiveCategory(null)}>
      <div className={styles.categoryRow}>
        {menuItems.map((item, index) => (
          <div key={index} className={styles.categoryContainer} onMouseEnter={() => setActiveCategory(item)}>
            <div className={styles.category} onClick={() => handleNavigation(item.path)}>
              {item.title}
            </div>
            {activeCategory && activeCategory.title === item.title && renderSubcategories(item.subcategories, item.title)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;
