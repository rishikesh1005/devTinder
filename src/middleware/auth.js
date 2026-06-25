const User = require("../models/user");
const jwt = require("jsonwebtoken")

const userAuth = async (req,res,next) => {
    try{
        const {token} = req.cookies;
        if(!token){
            const err = new Error("Please Login!");
            err.statusCode = 401;
            return next(err);
        }

        const decodedData  = await jwt.verify(token , process.env.JWT_SECRET);

        const { _id } = decodedData;
        const user = await User.findById(_id);
        if(!user){
            const err = new Error("User does not exist");
            err.statusCode = 404;
            throw err;
        }
        req.user = user;
        next();

    }catch(err){
        next(err)
    }
}

module.exports = {
    userAuth,
};