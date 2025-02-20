const dotenv =require("dotenv").config()
const express =require("express")
const mongoose =require("mongoose")
const cors=require("cors")
const cookieParser=require("cookie-parser")
const userRoute= require("./routes/userRoute")
const productRoute= require("./routes/productRoute")
const errorHandler = require("./middleware/errorMiddleware")


const app=express()

//MIDDLEWARES
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use(cors({
  origin:["http://localhost:3000", "https://shopitoapp.vercel.app"],
  credentials:true,
})
)


//ROUTES
app.use("/api/users",userRoute)
app.use("/api/products",productRoute)






app.get("/" ,(req,res)=>{
    res.send("Home Page...")
})

//ERROR MIDDLEWARE
app.use(errorHandler)

const PORT=process.env.PORT || 5000
mongoose.set('strictQuery', true);
mongoose
      .connect(process.env.MONGO_URI)
      .then(()=>{
        app.listen(PORT,()=>{
            console.log(`Server running on port ${PORT}`)
        })
      })

      .catch((err)=> console.log(err))