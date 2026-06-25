const validator = require("validator")

const validateSignUpData = (req) => {
    const {firstName, lastName , emailId , password} = req.body;

    if(!firstName || !lastName){
        const err = new Error("Enter correct Name");
        err.statusCode = 400;
        throw err;
    }else if(!validator.isEmail(emailId)){
        const err = new Error("Enter valid emailID");
        err.statusCode = 400;
        throw err;
    }else if(!validator.isStrongPassword(password)){
        const err = new Error("Enter Strong Password");
        err.statusCode = 400;
        throw err;
    }
};

const validateEditProfileData = (req) => {
    const allowedEditProfileData = ["firstName","lastName","age","skills","photoUrl","about" , "gender"]

    const isAllowedEdit = Object.keys(req.body).every((key) => allowedEditProfileData.includes(key) );

    return isAllowedEdit;
}

const validateEditPassword = (req) => {
    const {emailId , newPassword , confirmPassword} = req.body;

    if(!emailId || !newPassword || !confirmPassword){
        const err = new Error("Enter all required details");
        err.statusCode = 400;
        throw err;
    }else if(!validator.isEmail(emailId)){
        const err = new Error("Enter valid emailID");
        err.statusCode = 400;
        throw err;
    }else if(!validator.isStrongPassword(newPassword)){
        const err = new Error("Enter Strong Password");
        err.statusCode = 400;
        throw err;
    }

    if(newPassword !== confirmPassword){
       const err = new Error("Confirm Password incorrect");
        err.statusCode = 400;
        throw err;
    }

    const requiredDetails = ["emailId" , "newPassword" , "confirmPassword"]

    const isPasswordEditAllowed = Object.keys(req.body).every((key)=> requiredDetails.includes(key));

    return isPasswordEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData,
    validateEditPassword
}