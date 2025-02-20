import axios from "axios"


const BACKEND_URL =process.env.REACT_APP_BACKEND_URL
export const API_URL=`${BACKEND_URL}/api/users/`


//REGISTER_USER
const register =async(userData)=>{
    const response =await axios.post(API_URL +"register",userData, {
        withCredentials: true,
    })
    return response.data

}

//LOGIN_USER
const login =async(userData)=>{
    const response =await axios.post(API_URL +"login",userData)
    return response.data

}

//LOGOUT_USER
const logout =async(userData)=>{
    const response =await axios.get(API_URL +"logout")
    return response.data.message

}

//GET_LOGIN_STATUS
const getLoginStatus =async(userData)=>{
    const response =await axios.get(API_URL +"getLoginStatus")
    return response.data

}

//GET_USER
const getUser =async()=>{
    const response =await axios.get(API_URL +"getUser")
    return response.data

}

//UPDATE_USER
const updateUser =async(userData)=>{
    const response =await axios.patch(API_URL +"updateUser",userData)
    return response.data

}

//UPDATE_photo
const updatePhoto =async(userData)=>{
    const response =await axios.patch(API_URL +"updatePhoto",userData)
    return response.data

}


const authService = {
    register,
    login,
    logout,
    getLoginStatus,
    getUser,
    updateUser,
    updatePhoto
}
export default authService