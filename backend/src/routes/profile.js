const express = require('express');
const { userAuth } = require('../middleware/auth');
const { validateupdateProfileData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const profileRouter = express.Router();

profileRouter.get('/profile/view' , userAuth, async(req,res)=>{
     try {
        const user = req.user;  
        res.send(user);

     } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send("Error fetching profile");
     }
});

profileRouter.patch('/profile/edit' , userAuth , async(req,res)=>{
     try {
         if(!validateupdateProfileData(req)){
             throw new Error("Invalid fields in request body");
         }

         const loggedInUser = req.user;
         
         // Handle skills conversion from string to array
         if(req.body.skills){
             req.body.skills = req.body.skills.split(',').map(skill => skill.trim());
         }
         
         Object.keys(req.body).forEach((field)=>{
             loggedInUser[field] = req.body[field];
         });
         await loggedInUser.save();
         res.send("Profile updated successfully");
     } catch (error) {
         console.error('Error updating profile:', error);
         res.status(500).send("Error updating profile");
     }
});

profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).send("Please provide both current and new password");
        }

        const user = req.user;

        const isMatch = await user.validatePassword(currentPassword);

        if (!isMatch) {
            return res.status(400).send("Current password is incorrect");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.send("Password updated successfully");
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).send("Error updating password");
    }
});

module.exports = profileRouter;