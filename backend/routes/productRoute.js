const express = require("express");
const { getProducts, getProductById, getProductsBySource, getProductsByGender, getProductsBySourceAndGender, deleteProductsBySource, getProductsBySourceAndCategory, getProductsByGenderAndCategory, getProductsBySalePriceCategoryAndGender, searchProducts } = require("../controllers/productController");

const router = express.Router();
router.get('/search', searchProducts);

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/source/:source", getProductsBySource);
router.get("/gender/:gender",getProductsByGender)
router.get("/source/gender/:source/:gender",getProductsBySourceAndGender)
router.delete("/source/:source",deleteProductsBySource)
router.get("/source/category/:source/:category",getProductsBySourceAndCategory)
router.get("/gender/category/:gender/:category",getProductsByGenderAndCategory)
router.get("/sales/gender/category/:gender/:category", getProductsBySalePriceCategoryAndGender);

module.exports = router;
