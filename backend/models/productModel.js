const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: false },  // <-- Image is now optional
  link: { type: String, required: true },
  source: { type: String, required: true },
  gender:{type:String},
  scrapedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);