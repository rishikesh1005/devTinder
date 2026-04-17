const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user.js")
const bcrypt = require("bcrypt")

const {userAuth} = require("../middleware/auth.js");
const {validateEditProfileData , validateEditPassword} = require("../utils/validation.js")

profileRouter.get("/profile/view" , userAuth , async (req,res) => {
    try{
        const user = req.user;

        res.send(user);
    }catch(err){
        res.status(400).send("ERROR :" + err.message);
    }

})

profileRouter.patch("/profile/edit" , userAuth , async (req,res) => {
   try{
        if(!validateEditProfileData(req)){
        throw new Error("Invalid Edit Request!!!");
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
        res.status(400).send("ERROR:" + err.message);
   }
})

profileRouter.patch("/profile/password" , async(req,res) => {
    try{
        if(!validateEditPassword(req)){
            throw new Error("Enter neccessary details")
        } 

        const {emailId , newPassword} = req.body;

        const userPasswordChange = await User.findOne({emailId});
       
        if(!userPasswordChange){
            throw new Error("user do not exists!!!");
        }
        
        const hashNewPassword = await bcrypt.hash(newPassword , 10);
        
        userPasswordChange.password = hashNewPassword;
        await userPasswordChange.save();

        res.send("password changed successfully");
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = profileRouter;