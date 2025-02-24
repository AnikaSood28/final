const Product = require("../models/productModel");
const escapeStringRegexp = require('escape-string-regexp');

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

const searchProducts = async (req, res) => {
  try {
    const { q, page, limit } = req.query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;
    const skip = (parsedPage - 1) * parsedLimit;

    if (!q) {
      return res.status(400).json({ 
        success: false,
        error: 'Search query parameter "q" is required' 
      });
    }

    // Normalize and split query into terms
    const terms = q.toLowerCase().split(/\s+/).filter(term => term.length > 0);
    const genderTerms = {
      'men': 'men',
      'mens': 'men',
      'male': 'men',
      'women': 'women',
      'womens': 'women',
      'ladies': 'women',
      'female': 'women',
      'unisex': 'unisex'
    };

    // Separate gender terms from other terms
    const genderTermsFound = [];
    const nonGenderTerms = terms.filter(term => {
      const normalizedTerm = term.toLowerCase();
      if (genderTerms[normalizedTerm]) {
        genderTermsFound.push(genderTerms[normalizedTerm]);
        return false; // Exclude from nonGenderTerms
      }
      return true;
    });

    const searchConditions = [];

    // Apply gender filter if any gender terms found
    if (genderTermsFound.length > 0) {
      const genderFilter = genderTermsFound[0]; // Take the first found gender term
      searchConditions.push({
        gender: { $in: genderMap[genderFilter] || [genderFilter] }
      });
    }

    // Handle non-gender terms across brand, title, and category
    if (nonGenderTerms.length > 0) {
      const termConditions = nonGenderTerms.map(term => ({
        $or: [
          {source : new RegExp(escapeStringRegexp(term), 'i') },
          { title: new RegExp(escapeStringRegexp(term), 'i') },
          { category: new RegExp(escapeStringRegexp(term), 'i') }
        ]
      }));
      searchConditions.push({ $and: termConditions });
    }

    // If no conditions, search all relevant fields
    if (searchConditions.length === 0) {
      searchConditions.push({
        $or: [
          { source: new RegExp(escapeStringRegexp(q), 'i') },
          { title: new RegExp(escapeStringRegexp(q), 'i') },
          { category: new RegExp(escapeStringRegexp(q), 'i') }
        ]
      });
    }

    const searchQuery = searchConditions.length > 0 ? { $and: searchConditions } : {};

    const [products, total] = await Promise.all([
      Product.find(searchQuery)
        .sort({ scrapedAt: -1 })
        .skip(skip)
        .limit(parsedLimit),
      Product.countDocuments(searchQuery)
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
      currentPage: parsedPage,
      totalPages: Math.ceil(total / parsedLimit),
      hasMore: skip + parsedLimit < total
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
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
  searchProducts,
  getProductsBySalePriceCategoryAndGender // New Route
};
