const express = require("express");
const requestRouter = express.Router();
const mongoose = require("mongoose")

const {userAuth} = require("../middleware/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js")

requestRouter.post("/request/send/:status/:userId" , userAuth , async (req,res,next) => {
   
    try{ 
        const fromUserId = req.user._id
        const toUserId = req.params.userId
        const status = req.params.status

        // checking valid userId type is sent - matlab mongoose ke hisab se correct format mein hai ki nahi
        if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            return res.status(400).json({
                message: "Invalid userId",
            });
        }

        const allowedStatus = ["ignored" , "interested"]
        // status can only be either  ignored or intersted
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: "Invalid Staus Type",
            })
        }

        const toUserIdPresent = await User.findById(toUserId);
        if(!toUserIdPresent){
            return res.status(400).send({
                message: "User does not exists",
            })
        }

        const isPresent = await ConnectionRequest.findOne({
            $or: [
                {fromUserId , toUserId},
                {fromUserId : toUserId , toUserId: fromUserId}
            ]
        })
        if(isPresent){
            return res.status(400).send({
                message: "Request already Present",
            })
        }

        
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        })

        const data = await connectionRequest.save();
            res.json({
            message: req.user.firstName +" " + (status === "interested" ? "intersted in" : "ignored") + " " + toUserIdPresent.firstName,
            data
        })
    }
    catch(err){
       next(err)
    }
})


requestRouter.post("/request/review/:status/:requestId" , userAuth , async (req ,res,next) => {
    try{
        const loggedInUser = req.user;
        const {status , requestId} = req.params;

        const allowedStatus = ["accepted" , "rejected"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"status not valid"});
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "interested"
        })
        if(!connectionRequest){
            return res.status(404).json({
                message: "connection request not found",
            })
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({
            message: "connection request "+ (status === "accepted" ? "accepted" : "rejected"),
            data
        })

    }
    catch(err){
        next(err)
    }
})


module.exports = requestRouter;