const mongoose=require('mongoose')

const RegisterM=mongoose.Schema({
    username:String,
    password:String,
    firstName:String,
    lastName:String,
    email:String,
    mobile:String,
    img:String,
    created_date:{type:Date,default:new Date()},
    status:{type:String,default:'suspended'},
    role:{type:String,default:'public'}

})





module.exports = mongoose.model('register',RegisterM)