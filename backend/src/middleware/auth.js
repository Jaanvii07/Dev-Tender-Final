const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const userAuth=async(req,res,next)=>{
    try {
        const {token}=req.cookies;

        if(!token){
            return res.status(401).send("Please login");
        }

        const decoded=jwt.verify(token,"secretKey");
        const {_id}=decoded;
        const user=await User.findById(_id);
        if(!user){
            return res.status(404).send("User not found");
        }
        req.user=user;
        next();
    } catch (error) {
        return res.status(401).send("Invalid token");
    }

}

module.exports={
    userAuth
}