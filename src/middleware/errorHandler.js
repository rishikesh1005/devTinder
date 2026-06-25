const errorHandler = (err, req, res, next) => {

    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: Object.values(err.errors).map(e => e.message).join(", "),
        });
    }

    // JWT tampered/invalid
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ success: false, message: "Invalid token, please login again" });
    }

    // JWT expired
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Session expired, please login again" });
    }
 
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

module.exports = errorHandler;