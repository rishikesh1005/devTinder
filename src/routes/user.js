const express = require("express");
const userRouter = express.Router();

const {userAuth} = require("../middleware/auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName age gender about skills photoUrl";

userRouter.get("/user/requests/received" , userAuth , async(req,res,next) => {
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId : loggedInUser._id,
            status: "interested"
        }).populate("fromUserId" , USER_SAFE_DATA)

        res.json({
            message: "Data fetched Successfully",
            data : connectionRequests
        })
    }
    catch(err){
        next(err)
    }
})


userRouter.get("/user/connections" , userAuth , async (req,res,next) => {
    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id , status :"accepted"},
                {fromUserId: loggedInUser._id , status :"accepted"}
            ]
        })
        .populate("fromUserId" , USER_SAFE_DATA)
        .populate("toUserId" , USER_SAFE_DATA)  //agar request humne send ki hogi tho ismein required data hoga

        // check kar rahe konsa data bhejna h
        const data = connectionRequest.map((row)=> 
            row.fromUserId._id.toString() === loggedInUser._id.toString()
            ? row.toUserId
            : row.fromUserId
        );

        res.json({data})

    }
    catch(err){
        next(err)
    }
})


userRouter.get("/feed" , userAuth , async (req,res,next) => {
    try{
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 30 ? 30 : limit;
        const skip = (page - 1)*limit; 
        
        // yaha saare connectionRequest find kar rahe jo yaha tho user se bheji h ya receive kari h
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId : loggedInUser._id},
                {toUserId : loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        const hideUserFromFeed = new Set();

        // store kar rahe saare unique users
        connectionRequest.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString())
        })

        const users = await User.find({
            $and :[
                { _id : {$nin : Array.from(hideUserFromFeed)}},
                {_id : {$ne : loggedInUser._id}}
            ]
        })
          .select(USER_SAFE_DATA)
          .skip(skip)
          .limit(limit);

        res.json({data:users});

    }
    catch(err){
        next(err)
    }
})

module.exports = userRouter;