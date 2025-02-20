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
        { name: "Snitch", path: "/collections/Snitch" },
        { name: "Zara", path: "/collections/zara" },
        { name: "H&M", path: "/collections/hm" },
        { name: "Huemn", path: "/collections/huemn" },
        { name: "BurgerBae", path: "/collections/Burgerbae" },
        { name: "Bonkers Corner", path: "/collections/Bonkerscorner" },
        { name: "Almost Gods", path: "/collections/AlmostGods" }
      ]
    },
    {
    title: "Ladies",
    path: "/ladies",
    subcategories: [
      { name: "New In", path: "/ladies/new" },
      { name: "Clothing", path: "/ladies/clothing" },
      { name: "Sport", path: "/ladies/sport" },
      { name: "Dresses", path: "/ladies/dresses" },
      { name: "Tops", path: "/ladies/tops" },
      { name: "Bottoms", path: "/ladies/bottoms" },
      { name: "Shoes", path: "/ladies/shoes" },
      { name: "Accessories", path: "/ladies/accessories" },
      { name: "Bags", path: "/ladies/bags" },
      { name: "Lingerie", path: "/ladies/lingerie" },
      { name: "Beauty", path: "/ladies/beauty" },
      { name: "Jewelry", path: "/ladies/jewelry" },
      { name: "Nightwear", path: "/ladies/nightwear" }
    ]
  },
  {
    title: "Men",
    path: "/men",
    subcategories: [
      { name: "T-Shirts", path: "/men/tshirts" },
      { name: "Jeans", path: "/men/jeans" },
      { name: "Jackets", path: "/men/jackets" },
      { name: "Shirts", path: "/men/shirts" },
      { name: "Suits", path: "/men/suits" },
      { name: "Shoes", path: "/men/shoes" },
      { name: "Watches", path: "/men/watches" },
      { name: "Accessories", path: "/men/accessories" },
      { name: "Sweaters", path: "/men/sweaters" },
      { name: "Sportswear", path: "/men/sportswear" },
      { name: "Underwear", path: "/men/underwear" },
      { name: "Hoodies", path: "/men/hoodies" },
      { name: "Bags", path: "/men/bags" }
    ]
  },
  {
    title: "Latest",
    path: "/latest",
    subcategories: [
      { name: "New Styles", path: "/latest/new" },
      { name: "Trending", path: "/latest/trending" },
      { name: "Streetwear", path: "/latest/streetwear" },
      { name: "Techwear", path: "/latest/techwear" },
      { name: "Casual Wear", path: "/latest/casual" },
      { name: "Sneakers", path: "/latest/sneakers" },
      { name: "Denim", path: "/latest/denim" },
      { name: "Oversized", path: "/latest/oversized" },
      { name: "Formal", path: "/latest/formal" },
      { name: "Layering", path: "/latest/layering" },
      { name: "Luxury", path: "/latest/luxury" },
      { name: "Minimalist", path: "/latest/minimalist" }
    ]
  },
  {
    title: "Sale",
    path: "/sale",
    subcategories: [
      { name: "Discounts", path: "/sale/discounts" },
      { name: "Clearance", path: "/sale/clearance" },
      { name: "Limited Time Deals", path: "/sale/limited" },
      { name: "Last Chance", path: "/sale/last-chance" },
      { name: "Under ₹500", path: "/sale/under-500" },
      { name: "Under ₹1000", path: "/sale/under-1000" },
      { name: "50% Off", path: "/sale/50-off" },
      { name: "Buy 1 Get 1", path: "/sale/bogo" },
      { name: "Seasonal Offers", path: "/sale/seasonal" },
      { name: "Best Sellers", path: "/sale/best-sellers" },
      { name: "Outlet", path: "/sale/outlet" },
      { name: "Trending Sale", path: "/sale/trending" }
    ]
  }
];

const DropdownMenu = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className={styles.menuContainer} onMouseLeave={() => setActiveCategory(null)}>
      {/* Categories displayed side by side */}
      <div className={styles.categoryRow}>
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className={styles.categoryContainer}
            onMouseEnter={() => setActiveCategory(item)}
          >
            <NavLink 
              to={item.path} 
              className={styles.category}
            >
              {item.title}
            </NavLink>
            {activeCategory && activeCategory.title === item.title && (
              <div className={styles.dropdownContent}>
                {activeCategory.subcategories.map((subcategory, subIndex) => (
                  <NavLink key={subIndex} to={subcategory.path} className={styles.subcategory}>
                    {subcategory.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropdownMenu;