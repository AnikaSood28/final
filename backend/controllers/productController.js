const Product = require("../models/productModel");
const { getPriceConversionStages } = require("../utility/priceConversion");

const genderMap = {
  men: ["male", "Men", "unisex"],
  women: ["female", "Ladies", "unisex"],
  unisex: ["unisex"],
};
const getSortQuery = (sort) => {
  switch (sort) {
    case "priceLowHigh": return { priceNumeric: 1 }; // Price: Low to High
    case "priceHighLow": return { priceNumeric: -1 }; // Price: High to Low
    case "title_asc": return { title: 1 }; // Alphabetically A-Z
    case "title_desc": return { title: -1 }; // Alphabetically Z-A
    case "newest": return { scrapedAt: 1 }; // Oldest first
    default: return { scrapedAt: -1 }; // Default: Newest first
  }
};



const getProducts = async (req, res) => {
  try {
    let { page, limit, sort } = req.query; 
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      ...getPriceConversionStages(), // Reusable price conversion stages
      { $sort: getSortQuery(sort) },
      { $skip: skip },
      { $limit: limit }
    ]);

    const totalProducts = await Product.countDocuments();

    res.json({
      success: true,
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      hasMore: skip + limit < totalProducts,
    });
  } catch (error) {
    console.error('Price conversion error:', error);
    res.status(500).json({ 
      success: false,
      message: "❌ Server Error", 
      error: process.env.NODE_ENV === 'development' ? error : undefined 
    });
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
    let { page, limit, sort } = req.query; 
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      { $match: { source: req.params.source } },
      // Reuse the price conversion pipeline
      ...getPriceConversionStages(),
      { $sort: getSortQuery(sort) },
      { $skip: skip },
      { $limit: limit }
    ]);
    
    const totalProducts = await Product.countDocuments({ source: req.params.source });

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
    let { page, limit, sort } = req.query; 
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const genderFilter = genderMap[req.params.gender] || [req.params.gender];

    const products = await Product.aggregate([
      { $match: { gender: { $in: genderFilter } } },
      ...getPriceConversionStages(),
      { $sort: getSortQuery(sort) },
      { $skip: skip },
      { $limit: limit }
    ]);

    const totalProducts = await Product.countDocuments({ gender: { $in: genderFilter } });

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
    let { page, limit, sort } = req.query; 
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    const genderFilter = genderMap[req.params.gender] || [req.params.gender];

    const products = await Product.aggregate([
      { $match: { gender: { $in: genderFilter }, category: req.params.category } },
      ...getPriceConversionStages(),
      { $sort: getSortQuery(sort) },
      { $skip: skip },
      { $limit: limit }
    ]);

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
    let { page, limit, sort } = req.query; 
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
      { $match: { source: req.params.source, category: req.params.category } },
      ...getPriceConversionStages(),
      { $sort: getSortQuery(sort) },
      { $skip: skip },
      { $limit: limit }
    ]);

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


  const getProductsBySourceAndGender = async (req, res) => {
    try {
      let { page, limit, sort } = req.query; 
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const skip = (page - 1) * limit;
  
      const products = await Product.aggregate([
        { $match: { source: req.params.source, gender: req.params.gender } },
        ...getPriceConversionStages(),
        { $sort: getSortQuery(sort) },
        { $skip: skip },
        { $limit: limit }
      ]);
  
      const totalProducts = await Product.countDocuments({
        source: req.params.source,
        gender: req.params.gender,
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
  

  const getProductsBySalePriceCategoryAndGender = async (req, res) => {
    try {
      let { page, limit, sort } = req.query; 
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
      const skip = (page - 1) * limit;
      
      const genderFilter = genderMap[req.params.gender] || [req.params.gender];
  
      // Build aggregation pipeline
      const pipeline = [
        // Filter by category and gender first
        { 
          $match: { 
            category: req.params.category,
            gender: { $in: genderFilter }
          } 
        },
        // Reuse your helper function to clean and convert price fields
        ...getPriceConversionStages(),
        // Now, filter out products that do not have a valid sale price
        // (i.e. salePriceNumeric must exist and be less than regularPriceNumeric)
        { 
          $match: { 
            salePriceNumeric: { $ne: null },
            $expr: { $lt: ["$salePriceNumeric", "$regularPriceNumeric"] }
          }
        },
        { $sort: getSortQuery(sort) },
        { $skip: skip },
        { $limit: limit }
      ];
  
      const products = await Product.aggregate(pipeline);
  
      // Note: The total count may be slightly approximate if your conversion logic
      // is complex. You can also re-run an aggregation to get the total count.
      const totalProducts = await Product.countDocuments({
        category: req.params.category,
        gender: { $in: genderFilter },
        salePrice: { $exists: true, $ne: "N/A" }
      });
  
      res.json({
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        hasMore: skip + limit < totalProducts,
      });
    } catch (error) {
      console.error("Price conversion error:", error);
      res.status(500).json({ 
        message: "Server Error", 
        error: process.env.NODE_ENV === 'development' ? error : undefined 
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
  getProductsBySalePriceCategoryAndGender, // New Route
};
