const express = require('express');
const User = require('../models/user');
const { validateSignupData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');    

const authRouter = express.Router();

authRouter.post('/signup' , async(req,res)=>{
    try{
      validateSignupData(req);

    //encrypting password before saving to database
    const {firstName , lastName , email , password}=req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // creating new user instance in database
    const user=new User({
        firstName,
        lastName,
        email,
        password: hashedPassword
    })
    
    await user.save();
    res.send("User created successfully");
    }
    catch(error){
        console.error('Error creating user:', error);
        res.status(500).send("Error creating user");
    }
});

authRouter.post('/login' , async(req,res)=>{
    const {email , password}=req.body;

    try {
        const user= await User.findOne({email:email});
        if(!user){
            return res.status(404).send("Invalid email or password");
        }
        const isMatch= await user.validatePassword(password);
        if(isMatch){
           const token= await user.getJWT();
           res.cookie("token", token, { httpOnly: true });

          res.send("Login successful");
        }
        else{
            res.status(404).send("Invalid email or password");
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send("Error during login");
    }
});

authRouter.post('/logout' , async(req,res)=>{
    try{
        res.cookie("token" , null , {httpOnly:true , expires: new Date(0)});
        res.send("Logout successful");
    }
    catch(error){
        console.error('Error during logout:', error);   
        res.status(500).send("Error during logout");
    }
});

module.exports = authRouter;