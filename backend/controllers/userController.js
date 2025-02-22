const asyncHandler= require("express-async-handler")
const jwt = require("jsonwebtoken")
const bcrypt= require("bcryptjs")
const User = require("../models/userModel")

const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"1d" 
    })
}

const registerUser = asyncHandler(async(req,res)=>{
    const{name, email, password}=req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please Fill in all required fields!")
    }
    if(password.length<6){
        res.status(400)
        throw new Error("Password must contain at least 6 characters!")
    }
    const userExists=await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error("Email has already been used!")
    }

    const user= await User.create({
        name,
        email,
        password
    })


    const token =generateToken(user._id)

    if(user){
        const  {_id,name,email,role} = user
        res.cookie("token", token,{
            path:"/",
            httpOnly:true,
            expires: new Date(Date.now()+1000*86400),
            // secure:true,
            // sameSite:none
        })
        res.status(201).json({
            _id,name, email,role, token
    
        })

    }else{
        res.status(400)
        throw new Error("Invalid user data")
    }
    


    res.send("Register User...")

})

const loginUser= asyncHandler(async(req,res)=>{
    const {email,password}= req.body
    if(!email|| !password){
        res.status(400)
        throw new Error("Please add an email and password!")
    }
    const user = await User.findOne({ email })
    if(!user){
        res.status(401)
        throw new Error("User does not exist!")
    }

    const passwordIsCorrect= await bcrypt.compare(password,user.password)

    const token = generateToken(user._id)
    if(user && passwordIsCorrect)
     {
        const newUser = await User.findOne({ email }).select("-password")
        res.cookie("token", token,{
            path:"/",
            httpOnly:true,
            expires: new Date(Date.now()+1000*86400),
            // secure:true,
            // sameSite:none
        })
        res.status(201).json(newUser)



     }else{
        res.status(401)
        throw new Error("Invalid email or password!")

     }
    
})

const logoutUser = asyncHandler(async(req,res)=>{
    res.cookie("token", "token",{
        path:"/",
        httpOnly:true,
        expires: new Date(0),
        // secure:true,
        // sameSite:none
    })
    res.status(200).json({message:"Successfully logged out!"})
})

const getUser = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id).select("-password")
    if(user){
        res.status(200).json(user)
    }else{
        res.status(400)
        throw new Error("User not found!")

    }
})

const getLoginStatus = asyncHandler(async(req,res)=>{
   const token =req.cookies.token

   if(!token){
    return res.json({ isLoggedIn: false });
   }

   try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ isLoggedIn: true });
} catch (error) {
    res.json({ isLoggedIn: false, message: "Invalid token" });
}
})

const updateUser=asyncHandler(async(req,res)=>{
   const user = await User.findById(req.user._id)

   if(user){
    const{name, phone, address}= user
    user.name= req.body.name|| name
    user.phone= req.body.phone || phone
    user.address= req.body.address|| address

    const updatedUser= await user.save()
    res.status(200).json(updatedUser)
   }else{
    res.status(404)
    throw new Error("User not found!")
   }
})

const updatePhoto= asyncHandler(async(req,res)=>{
    const {photo}= req.body
    const user = await User.findById(req.user._id)

    user.photo=photo
    const updatedUser= await user.save()
    res.status(200).json(updatedUser)
})


module.exports={
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    getLoginStatus,
    updateUser,
    updatePhoto
    
}