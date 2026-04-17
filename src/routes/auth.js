const express = require("express");
const authRouter = express.Router();

const {validateSignUpData} = require("../utils/validation.js")
const User = require("../models/user.js")
const bcrypt = require("bcrypt");

authRouter.post("/signup" , async (req,res) => {
    try{
    // validating the data
    validateSignUpData(req);

    const {firstName , lastName , emailId , password} = req.body

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password,10);

    // creating new instance of user
    const user = new User({
        firstName, 
        lastName , 
        emailId , 
        password : passwordHash
    });

    
        const savedUser =  await user.save();

        // create JWT Token
        const token = await savedUser.getJWT();

        // pass in the cookies
        res.cookie("token" , token , {expires : new Date(Date.now() + 8 * 3600000)});

        res.json({
            message: "user added successfully!!!",
            data: savedUser,
        })
    }catch(err) {
        console.error("error occured:"+ err.message)
        res.status(400).send("error occured:"+ err.message)
    }
})

authRouter.post("/login" , async (req, res) => {
 try{
       // get data
    const {emailId , password} = req.body;

    const user = await User.findOne({emailId: emailId});
    if(!user){
        throw new Error("Invalid Credentials!!!");
    }

    const isPasswordValid = await user.validatePassword(password);

    if(isPasswordValid){
        // create JWT Token
        const token = await user.getJWT();

        // pass in the cookies
        res.cookie("token" , token , {expires : new Date(Date.now() + 8 * 3600000)});

        res.send(user);
    }else{
        throw new Error("Invalid Credentials!!!");
    }
 }catch(err){
    res.status(400).send("ERROR : " + err.message);
 }
})

authRouter.post("/logout" , async (req,res) => {
    res.cookie("token" , null , {
        expires: new Date(Date.now())
    })

    res.send("loggedOut succesfully!!!");
})

module.exports = authRouter;