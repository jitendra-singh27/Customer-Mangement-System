const Regist=require('../model/register')
const bcrypt=require('bcrypt')

const nodemailer=require('nodemailer')

 
function handlelogin(req,res,next){
    if(req.session.isAuth){
        next()
    }else{
       res.redirect('/login')
    }
}

let sess=null
 
exports.RegisterUser=function(req,res){
    res.render('register.ejs')//{message:''} use in ejs page <%=message%>)
}

exports.RegisterRecord= async function(req,res){
    const{user,pass}=req.body
    const encryptpass= await bcrypt.hash(pass,10)
    //console.log(encryptpass)
    const usernamecheck= await Regist.findOne({username:user})
    if(usernamecheck==null){
    
        const record=new Regist({username:user,password:encryptpass})
    await record.save()
    //res.render('register.ejs',{message:'Account Successfully Created'})

    }else{
        res.send (`${user} : Username Alredy Existed Plz Try Another Username`)
    }
     
    res.redirect("/login")
}

exports.loginshow=function(req,res){
    res.render('login.ejs',{message:''})
}







exports.profilepageshow= handlelogin,(req,res)=>{
      //handlelogin,
    res.render('index.ejs')
}
    

exports.adminloginshow=function(req,res){
    res.render('admin/admin.ejs')
}


exports.adminlogincheck=async function(req,res){
    console.log(req.body)
    const {username,pass}=req.body
   const record=await Regist.findOne({username:username})
   //console.log(record)
   if(record!==null){
    res.redirect('/admin/dashboard')
   }else{
    res.redirect("/admin")
   }
}

exports.admindashboardshow=function(req,res){
    res.render('admin/dashboard.ejs')
}


exports.adminlogout= function(req,res){
    req.session.destroy()
    res.redirect("/admin/")
}


exports.adminusershow=async function(req,res){
    const record=await Regist.find().sort({created_date:-1})
    const totaluser=await Regist.count()
    const totalactive=await Regist.count({status:"active"})
    const totalsuspend=await Regist.count({status:'suspended'})
    res.render('admin/usermanage.ejs',{record,totalactive,totaluser,totalsuspend})
}

exports.adminuserstatuspdate=async function(req,res){
    const id=req.params.id
    const record =await Regist.findById(id)
    let newstatus=null
    if (record.status=="suspended"){
       newstatus="active"
    } else{
        newstatus="suspended"
    }
     await Regist.findByIdAndUpdate(id,{status:newstatus})
     res.redirect("/admin/user")
}


exports.adminuserroleupdate= async (req,res)=>{
    const id=req.params.id
   const record= await Regist.findById(id)
   let newrole=null
   if(record.role=="public"){
    newrole='private'
   }else{
    newrole='public'
   }
   await Regist.findByIdAndUpdate(id,{role:newrole})
   res.redirect("/admin/user")
}






exports.profile=async function(req,res){
    const username=req.session.username
    const record= await Regist.findOne({username:username})
    res.render("profile.ejs",{username,record})
}


exports.profileupdaterecord=async  (req,res)=>{
    console.log(req.session)
    const username=req.session.username
    console.log(req.file)
   const filename=req.file.filename
    const{fname,lname,email,mno}=req.body
    await Regist.findOneAndUpdate(username,{firstName:fname,lastName:lname,email:email,mobile:mno,img:filename})
   
    res.redirect('/profile')
    
}


exports.forgetpass=async(req,res)=>{
   const username=req.session.username
    res.render("passwordmange.ejs",{username,message:''})
}


exports.passwordchangesave=async  function(req,res){
    const username=req.session.username
    const {cpass,npass}=req.body
    const newpass= await bcrypt.hash(npass,10)
   const record= await Regist.findOne({username:username})
   const comparpass=await bcrypt.compare(cpass,record.password)
   if(comparpass){
    await Regist.findOneAndUpdate(username,{password:newpass,message:"You have entered wrong password "})
   req.session.destroy()
    res.redirect('/login')
   }else{
    res.render('passwordmange.ejs',{username,message:"You have entered wrong password "})
   }
}

exports.forgetpassform= function (req,res){
    res.render('forgetpass.ejs',{message:''})
}

exports.forgetpassuser=async function (req,res){
  const{username}=req.body
 const record=await Regist.findOne({username:username}) 
 console.log(record)
 if(record.email!==''){
    const customeremail=record.email

    //---Nodemailer Setup---//
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'testnode880@gmail.com', // generated ethereal user
        pass: 'miolbqhqdxltdgdw', // generated ethereal password
      },
    });


    console.log('SmpT Connected')

    let info = await transporter.sendMail({
        from:  'testnode880@gmail.com', // sender address
        to: customeremail, // list of receivers
        subject: "Password Change", // Subject line
        text: "Click Link To Change Password", // plain text body
        html: ` <a href="http://localhost:5000/forgetlinkp/${username}">Click Link To Reset Password</a>`, // html body
      });
     }
     console.log('email Send')
     res.redirect("/login")

  // send mail with defined transport object
}


exports.newpassformp=(req,res)=>{
    console.log(req.params.username)
    const username=req.params.username
    res.render("forgetlinkpass.ejs",{username})
    
}

exports.NewPassSet= async (req,res)=>{
    const username=req.params.username
    const {npass}=req.body
    const encrypass=await bcrypt.hash(npass,10)
    await Regist.findOneAndUpdate(username,{password:encrypass})
    res.redirect("/login")
}





 
