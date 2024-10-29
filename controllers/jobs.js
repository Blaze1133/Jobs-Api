const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError,NotFoundError} = require('../errors/index')

const getAllJobs = async(req,res) =>{
    const job = await Job.find({createdBy:req.user.userId}).sort('createdAt') // Returning all jobs created by the specific user
    if(!job){
        throw new NotFoundError('No Job Found')
    }
    res.status(StatusCodes.OK).json({job,count:job.length});
}
const getJob = async(req,res) =>{ // getting a specific job created by a specific user  
    const {user:{userId},params:{id:jobId}} = req // nested destructuring, the data send after authentication is done in the req object
    const job = await Job.findById({_id:jobId,createdBy:userId})
    if(!job){
        throw new NotFoundError('Ivalid Job Id')
    }
    res.status(StatusCodes.OK).json({job});    
}
const createJob = async(req,res) =>{
    req.body.createdBy = req.user.userId; // Since the the body only consists of comany name and position and the person who is creating the job is the user, which is in the req.user.userid, where we have sent it through the auth middleware
    console.log(req.body);
    
    const job = await Job.create({...req.body})
    if(!job){
        throw new NotFoundError('Invalid Job Data')
    }
    res.status(StatusCodes.CREATED).json({job})
}
const updateJob = async(req,res) =>{
    const{
        body : {company,position}, // this is the new data, that will be updated
        user:{userId}, // destructuring company and position from req.body
        params:{id:jobId}
    } = req // this regers to the object that we are destructuring from
    
    if(company === '' || position === ''){
        throw new NotFoundError('Comapny or Position cannot be empty')
    }
    const job = await Job.findByIdAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,runValidators:true})
    if(!job){
    throw new NotFoundError(`No Job found with Id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}
const deleteJob = async(req,res) =>{
    const { // deleting a specific job created by a specific user
        user : {userId},
        params:{id:jobId}
    } = req;
    const job = await Job.findByIdAndDelete({_id:jobId,createdBy:userId})
    if(!job){
        throw new NotFoundError('Ivalid Job Id')
    }
    res.status(StatusCodes.OK).send()
}



module.exports = {getAllJobs,getJob,createJob,updateJob,deleteJob};