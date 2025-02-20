const Product=require("../models/productModel")
const getProducts = async (req, res) => {
    try {
      const products = await Product.find().sort({ scrapedAt: -1 });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "❌ Server Error", error });
    }
  };
const getProductById=async(req,res)=>{

try{
    const product=await Product.findById(req.params.id);
    if(!product)
        return res.status(404).json({message:"Product not found"});
    res.json(product)

}catch(error){
res.status(500).json({message:"Server error",error});
}
};

const getProductsBySource=async(req,res)=>{
    try{
        const product=await Product.find({source:req.params.source}).sort({scrapedAt:-1})
   res.json(product)
  } catch (error) {
    res.status(500).json({ message: " Server Error", error });
  }
}
const getProductsByGender=async(req,res)=>{
  try{
      const product=await Product.find({gender:req.params.gender}).sort({scrapedAt:-1})
 res.json(product)
} catch (error) {
  res.status(500).json({ message: " Server Error", error });
}
}
const getProductsBySourceAndGender = async (req, res) => {
  try {
    const products = await Product.find({ 
      source: req.params.source, 
      gender: req.params.gender 
    }).sort({ scrapedAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = { getProducts, getProductById, getProductsBySource,getProductsByGender,getProductsBySourceAndGender };