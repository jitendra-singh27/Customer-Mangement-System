const router=require('express').Router()
const RegisterM=require('../model/register')
const registerc=require('../controllers/registercontroller')


router.get('/',registerc.adminloginshow)
router.post('/adminrec',registerc.adminlogincheck)
router.get('/dashboard',registerc.admindashboardshow)
router.get('/logout',registerc.adminlogout)
router.get('/user',registerc.adminusershow)
router.get('/userstatusupdate/:id',registerc.adminuserstatuspdate)
router.get('/userrole/:id',registerc.adminuserroleupdate)


module.exports=router