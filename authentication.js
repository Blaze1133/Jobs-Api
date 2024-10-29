const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors/index');

// Basically we are creating a middleware to verify and validate the token
const auth = (req,res,next)=>{
    const authHeader = req.headers.authorization; // the toen will be stored in req.headers
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authentication Failed');
    }

    const token = authHeader.split(' ')[1]; // splitting the token from the header
    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET); // after the verification, the token data is decoded
        req.user = {userId:payload.userId,name:payload.name}; // setting the user id and name in the request
        next();
    }catch(err){
        throw new UnauthenticatedError('Authentication Failed');
    }
}

module.exports = auth;