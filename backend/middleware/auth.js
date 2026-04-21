const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");

exports.isAuthenticated = catchAsyncErrors(async(req,res,next) => {
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    next();
});


exports.isSeller = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.seller_token;
    if (!token) return next(new ErrorHandler("Login required", 401));
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const seller = await Shop.findById(decoded.id);
    if (!seller) {
        return next(new ErrorHandler("Seller not found", 404));
    }
    if (seller.isApproved === false) {
        return next(new ErrorHandler("Your shop is pending admin approval", 403));
    }
    req.seller = seller;
    next();
  });


exports.isAdmin = (...roles) => {
    const allowedRoles = roles.map((role) => String(role).toLowerCase());
    return (req,res,next) => {
        const userRole = String(req.user?.role || "").toLowerCase();
        if(!allowedRoles.includes(userRole)){
            return next(new ErrorHandler(`${req.user?.role} can not access this resources!`))
        };
        next();
    }
}
