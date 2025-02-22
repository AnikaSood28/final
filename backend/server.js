const dotenv =require("dotenv").config()
const express =require("express")
const path=require("path")
const mongoose =require("mongoose")
const cors=require("cors")
const cookieParser=require("cookie-parser")
const userRoute= require("./routes/userRoute")
const productRoute= require("./routes/productRoute")
const errorHandler = require("./middleware/errorMiddleware")
const connectDB = require("./config/db")
const wishListRoute=require("./routes/wishRoute")

const app=express()

//MIDDLEWARES
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))


app.use(cors({
  origin: "http://localhost:3000", // your frontend URL
  credentials: true,  // this is important
}));

// Also set these headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

//ROUTES
app.use("/api/users",userRoute)
app.use("/api/products",productRoute)


app.use("/api/wishlist",wishListRoute)



app.get("/" ,(req,res)=>{
    res.send("Home Page...")
})

//ERROR MIDDLEWARE
app.use(errorHandler)

const PORT=process.env.PORT || 5000
mongoose.set('strictQuery', true);
connectDB().then(()=>{
  app.listen(PORT,()=>console.log(`Server running on port${PORT}`))
})
connectDB()
app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
