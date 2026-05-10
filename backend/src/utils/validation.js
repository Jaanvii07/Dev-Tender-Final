const { json } = require('sequelize');
const validator = require('validator');

const validateSignupData = (req)=>{
     const {firstName , lastName , email , password}=req.body;

     if(!firstName || !lastName){
        throw new Error("Please enter both firstName and LastName");
     }
     else if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
     }
     else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter Strong password");
     }
}

const validateupdateProfileData = (req)=>{
    const allowedFields=['firstName' , 'lastName' , 'email' , 'about' , 'skills' , "age" , "gender" , "photoUrl"];

    const isEditAllowed= Object.keys(req.body).every((field)=>{
        return allowedFields.includes(field);
    });
    return isEditAllowed;
}

const validatePasswordUpdate =(req)=>{
      const {currentPassword , newPassword}= req.body;
      if(!currentPassword || !newPassword){
        throw new Error("Please provide both current and new password");
      }
      else if(!validator.isStrongPassword(newPassword)){
        throw new Error("Please enter Strong password");
      }   
}

module.exports={validateSignupData, validateupdateProfileData, validatePasswordUpdate };