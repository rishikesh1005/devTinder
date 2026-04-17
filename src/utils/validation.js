const validator = require("validator")

const validateSignUpData = (req) => {
    const {firstName, lastName , emailId , password} = req.body;

    if(!firstName || !lastName){
        throw new Error("Enter correct Name");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Enter valid emailID...");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Enter Strong Password...");
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
        throw new Error("Enter all requires details")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Enter valid emailID...");
    }else if(!validator.isStrongPassword(newPassword)){
        throw new Error("Enter Strong Password...");
    }

    if(newPassword !== confirmPassword){
        throw new Error("confirm Password incorrect!!!")
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