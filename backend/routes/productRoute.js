const express = require("express");
const { getProducts, getProductById, getProductsBySource, getProductsByGender, getProductsBySourceAndGender, deleteProductsBySource } = require("../controllers/productController");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/source/:source", getProductsBySource);
router.get("/gender/:gender",getProductsByGender)
router.get("/source/gender/:source/:gender",getProductsBySourceAndGender)
router.delete("/source/:source",deleteProductsBySource)

module.exports = router;
