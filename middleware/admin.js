const jwt=require('jsonwebtoken');
const {JWT_ADMIN_PASSWORD}=require('../config');

function adminMiddleware(req,res,next){
    const token= req.headers.authorization;
    const decorded=jwt.verify(token,JWT_ADMIN_PASSWORD);
    if(decorded){
        req.userId=decorded.id;
        next();

    }else{
        res.status(403).json({
            message:"invalid credentails"
        })
    }
}

module.exports={
    adminMiddleware
}