const router=require('express').Router()

const registerc=require('../controllers/registercontroller')
const testic=require('../controllers/testicontroller')
const Regist=require('../model/register')
const bcrypt=require('bcrypt')
const multer=require('multer')


let storage=multer.diskStorage({
    destination: function(req,file,cb){
      cb(null,'./public/upload')
    },
    filename: function(req,file,cb){
      cb(null,Date.now()+file.originalname)
    }

})

let upload=multer({
  storage:storage,
  limits:{fieldSize:1024*1024*20}
})


function handlelogin(req,res,next){
    if(req.session.isAuth){
        next()
    }else{
       res.redirect('/login')
    }
}

function handlerole(req,res,next){
    if(req.session.role=="private"){
      next()
    }else{
        res.send('you cant access')
    }
}



//registeration
router.get('/regis',registerc.RegisterUser)
router.post('/registerrec',registerc.RegisterRecord)

//login
router.get('/login',registerc.loginshow)
router.post('/loginrec',async function(req,res){
    const {user,pass}=req.body
    const record=await Regist.findOne({username:user})
    console.log(record)
    if(record.status=="active"){
        if(record!==null){
            const comparepass=await bcrypt.compare(pass,record.password)
         if(comparepass){
            req.session.isAuth=true
            sess=req.session
            sess.username=user
            sess.role=record.role
            res.redirect('/')
        }  else{
            res.render('login.ejs',{message:"You have entered an invalid username / password combination."})
        }
          }else{
            res.render('login.ejs',{message:"You have entered an invalid username / password combination."})
        }
        }else{
            res.send('your account is Suspended plx contact to admin')
        }

})
router.get('/logout', function(req,res){
    req.session.destroy()
    res.redirect("/login")
} )

//profile 
router.get('/', handlelogin,(req,res)=>{
     //console.log(sess.username)   //handlelogin,
     if(sess!==null){
        res.render('index.ejs',{username:sess.username})     
     }else{
        res.render('index.ejs',{username:"Hello User"}) 
     }
    
})

router.get('/testinomial',handlelogin, handlerole,testic.testinomalpageshow)

router.get('/profile',handlelogin,registerc.profile)

//profileupdaterecord
router.post('/profilerecord',handlelogin,upload.single("img"), registerc.profileupdaterecord)

router.get('/forgetpass',handlelogin,registerc.forgetpass)

router.post('/passwordrecover',handlelogin,registerc.passwordchangesave)

router.get('/forgetpaass',registerc.forgetpassform)

router.post('/forgetpaaas',registerc.forgetpassuser)

router.get('/forgetlinkp/:username',registerc.newpassformp)

router.post('/newpassset/:username',registerc.NewPassSet)







module.exports=router