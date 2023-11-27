const mongoose=require('mongoose')

const testi=mongoose.Schema({
    img:String,
    quotes:String,
    name:String
})


module.exports=mongoose.model('testinomial',testi)