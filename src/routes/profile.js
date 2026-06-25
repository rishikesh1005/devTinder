const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user.js")
const bcrypt = require("bcrypt")

const {userAuth} = require("../middleware/auth.js");
const {validateEditProfileData , validateEditPassword} = require("../utils/validation.js")

profileRouter.get("/profile/view" , userAuth , async (req,res,next) => {
    try{
        const user = req.user;

        res.send(user);
    }catch(err){
        next(err);
    }

})

profileRouter.patch("/profile/edit" , userAuth , async (req,res,next) => {
   try{
        if(!validateEditProfileData(req)){
            const err = new Error("Invalid Edit Request!!!");
            err.statusCode = 400;
            throw err;
        }

        const loggedInUser = req.user;

        console.log(loggedInUser)
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])

        await loggedInUser.save();

        console.log(loggedInUser);

        res.json({
            message : "your profile updated successfully!!!" , 
            data : loggedInUser
        });
   }
   catch(err){
        next(err);
   }
})

profileRouter.patch("/profile/password" , async(req,res,next) => {
    try{
        if(!validateEditPassword(req)){
            const err = new Error("Enter necessary details");
            err.statusCode = 400;
            throw err;
        } 

        const {emailId , newPassword} = req.body;

        const userPasswordChange = await User.findOne({emailId});
       
        if(!userPasswordChange){
            const err = new Error("User does not exist");
            err.statusCode = 404;
            throw err;
        }
        
        const hashNewPassword = await bcrypt.hash(newPassword , 10);
        
        userPasswordChange.password = hashNewPassword;
        await userPasswordChange.save();

        res.send("password changed successfully");
    }
    catch(err){
        next(err);
    }
})

module.exports = profileRouter;