const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Since the hashing will be done before saving the document
const jwt = require('jsonwebtoken'); // Library which is used for creating tokens
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please Provide a name'],
        minLength:3,
        maxLength:50
    },
    email:{
        type:String,
        required:[true, 'Please Provide a name'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email'], // this is used for regular expression matching
        unique:true //By setting the email field as unique, you ensure that no two users can register with the same email address. 
                    //This maintains the integrity of your user data.
    },
    password:{
        type:String,
        required:[true, 'Please Provide a password'], // the passwords will always be hashed in the database, and this hased value is checked
        minLength:6,

    }
})

// this is a middleware function, which will be executed before the document is saved
UserSchema.pre('save',async function(next){
    const salt =  await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt); // Since we are modiyfying  the password before the document is saved
    next(); //passing  the control to the next middleware
})

// Schema methods are nothing but functions attached directly to schema, which can be used on schema documents

UserSchema.methods.createJwt = function(){
   return jwt.sign({userId:this.id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch =  await bcrypt.compare(candidatePassword,this.password)  // checked whether the password entered by the user is same as the password in the database
    return isMatch
}

module.exports = mongoose.model('User',UserSchema);

