const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength : 3,
        maxLength: 50,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowerCase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email!! enter correct emailId" + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password not Strong!!! Enter strong Password")
            }
        }
    },
    age: {
        type: String,
        min: 18,
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid!!!");
            }
        }
    },
    photoUrl:{
        type: String,
        default : "https://th.bing.com/th/id/OIP.r2k0JLQia3jR_yrRDCmPcQHaHa?w=181&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter correct URL...");
            }
        }
    },
    about:{
        type: String,
        default: "This is a default about of the user!",
    },
    skills: {
        type : [String],
    },
},
{
    timestamps: true,
})


userSchema.methods.getJWT = async function(){
    const user = this;

    const token = await jwt.sign({_id: user._id} , process.env.JWT_SECRET , {expiresIn: "7d"} );
    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser , passwordHash);

    return isPasswordValid;
}


const User = mongoose.model("User" , userSchema);

module.exports = User;