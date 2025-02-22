import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = "http://localhost:5000";

const useWishlist = (user) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?._id) return;

      try {
        const response = await axios.get(`${BACKEND_URL}/api/wishlist/${user._id}`);
        setWishlistItems(response.data.items || []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };

    fetchWishlist();
  }, [user]);

  const handleWishlist = async (productId) => {
    if (!user) {
      toast.error("Please login to manage your wishlist");
      return;
    }

    try {
      const isInWishlist = wishlistItems.some((item) => item._id === productId);

      if (isInWishlist) {
        await axios.delete(`${BACKEND_URL}/api/wishlist/remove`, {
          data: { userId: user._id, productId },
        });
        setWishlistItems(wishlistItems.filter((item) => item._id !== productId));
        toast.success("Removed from wishlist");
      } else {
        await axios.post(`${BACKEND_URL}/api/wishlist/add`, {
          userId: user._id,
          productId,
        });
        setWishlistItems([...wishlistItems, { _id: productId }]);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      toast.error("Failed to update wishlist");
      console.error("Wishlist operation failed:", err);
    }
  };

  return { wishlistItems, handleWishlist };
};

export default useWishlist; // ✅ Ensure correct export
