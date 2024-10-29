const User = require('../models/User')
const {StatusCodes} = require('http-status-codes');
const {BadRequestError,UnauthenticatedError} = require('../errors/index')

const register = async(req,res) =>{
    const user = await User.create({...req.body}) // using the spread operator to unpack the elements   
    const token = user.createJwt();
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})
}

const login = async(req,res) =>{
    const {email,password} = req.body;
    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({email}) // finding the user by his email id, and addditionally we will also be getting name and passowrd
    if(!user){
        throw new UnauthenticatedError('Invalid Crendentials');
    }
    const isPasswordCorrect = await user.comparePassword(req.body.password); // this compare function logic is written in the user model
    if(!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid Crendentials');
    }    
    const token = user.createJwt();
    res.status(StatusCodes.OK).json({user:{name:user.name},token})
}

module.exports = {register,login};