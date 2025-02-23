const Product = require("../models/productModel");

const genderMap = {
  men: ["male", "Men", "unisex"],
  women: ["female", "Ladies", "unisex"],
  unisex: ["unisex"],
};

const getProducts = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .sort({ scrapedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments();

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasMore: skip + limit < totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Server Error", error });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getProductsBySource = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({ source: req.params.source })
      .sort({ scrapedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({
      source: req.params.source,
    });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasMore: skip + limit < totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const getProductsByGender = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const genderFilter = genderMap[req.params.gender] || [req.params.gender];

    const products = await Product.find({ gender: { $in: genderFilter } })
      .sort({ scrapedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({
      gender: { $in: genderFilter },
    });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasMore: skip + limit < totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const getProductsBySourceAndGender = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const genderFilter = genderMap[req.params.gender] || [req.params.gender];

    const products = await Product.find({
      source: req.params.source,
      gender: { $in: genderFilter },
    })
      .sort({ scrapedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({
      source: req.params.source,
      gender: { $in: genderFilter },
    });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasMore: skip + limit < totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const getProductsByGenderAndCategory = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const genderFilter = genderMap[req.params.gender] || [req.params.gender];

    const products = await Product.find({
      gender: { $in: genderFilter },
      category: req.params.category,
    })
      .sort({ scrapedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({
      gender: { $in: genderFilter },
      category: req.params.category,
    });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasMore: skip + limit < totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const getProductsBySourceAndCategory = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find({
      source: req.params.source,
      category: req.params.category,
    })
      .sort({ scrapedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({
      source: req.params.source,
      category: req.params.category,
    });

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasMore: skip + limit < totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const deleteProductsBySource = async (req, res) => {
  try {
    const result = await Product.deleteMany({ source: req.params.source });
    res.json({
      message: "✅ Products deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Server Error", error });
  }
};

// ✅ New Function: Get Products by Sale Price, Category, and Gender
// Conditions:
// 1. salePrice must not be null
// 2. salePrice must not equal price (using $expr for field-to-field comparison)
// 3. Filter by category and gender (using genderMap)
const getProductsBySalePriceCategoryAndGender = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const genderFilter = genderMap[req.params.gender] || [req.params.gender];
    
    // Strengthened query to properly exclude null values
    const query = {
      category: req.params.category,
      gender: { $in: genderFilter },
      salePrice: { 
        $exists: true,    // Must have salePrice field
        $type: "string",  // Must be a string type
        $ne: "N/A"        // Cannot be "N/A"
      },
      $expr: { 
        $and: [
          { $ne: ["$salePrice", null] },  // Explicit null check
          { $ne: ["$salePrice", ""] },    // Empty string check
          { $lt: ["$salePrice", "$price"] }  // Price comparison
        ]
      }
    };

    const products = await Product.find(query)
      .sort({ scrapedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasMore: skip + limit < totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};



module.exports = {
  getProducts,
  getProductById,
  getProductsBySource,
  getProductsByGender,
  getProductsBySourceAndGender,
  getProductsByGenderAndCategory,
  getProductsBySourceAndCategory,
  deleteProductsBySource,
  getProductsBySalePriceCategoryAndGender, // New Route
};
