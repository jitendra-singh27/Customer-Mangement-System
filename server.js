const express=require('express')
const app=express()
app.use(express.urlencoded({extended:false}))
const adminRouter=require('./routers/admin')
const frontendRouter=require('./routers/frontend')
const multer=require('multer')
require('dotenv').config()
const mongoose=require('mongoose')
const session=require("express-session")
mongoose.connect(process.env.DB_URL +'/'+ process.env.DB_NAME)





app.use(session({
    secret:"CMS",
    saveUninitialized:false,
    resave:false,
    //cookie:{maxAge:1000*60*60*24*365} //For Login perment or 1 yr with logout

}))
app.use('/',frontendRouter)
app.use('/admin',adminRouter)
app.use(express.static('public'))
app.set("view engine",'ejs')
app.listen(process.env.PORT,function(){
    console.log(`Successfully Conntected TO Port ${process.env.PORT}`)
})