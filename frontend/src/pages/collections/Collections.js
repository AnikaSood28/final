import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Collections = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get unique collections from products
  const getUniqueCollections = (products) => {
    const collections = [...new Set(products.map(product => product.collection))];
    return collections.map(collection => ({
      name: collection,
      // Get first product image from each collection as cover
      coverImage: products.find(p => p.collection === collection)?.imageUrl,
      // Calculate total products in collection
      productCount: products.filter(p => p.collection === collection).length,
      path: `/collections/${collection.toLowerCase()}`
    }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Collections</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const collections = getUniqueCollections(products);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection, index) => (
          <NavLink 
            key={index}
            to={collection.path}
            className="group block"
          >
            <Card className="overflow-hidden transform transition-all duration-300 hover:scale-105">
              <div className="relative aspect-[4/3]">
                <img 
                  src={collection.coverImage || '/placeholder-image.jpg'} 
                  alt={collection.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                  <p className="text-sm opacity-90">{collection.productCount} Products</p>
                  <button className="mt-4 px-6 py-2 bg-white text-black rounded-full 
                                   transform transition-all duration-300 
                                   opacity-0 group-hover:opacity-100 hover:bg-gray-100">
                    Shop Now
                  </button>
                </div>
              </div>
            </Card>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Collections;