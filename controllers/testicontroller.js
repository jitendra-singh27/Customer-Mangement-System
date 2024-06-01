const testM=require('../model/tetinomial')

let sess=null






exports.testinomalpageshow=(req,res)=>{
    console.log(req.session)
    const username=req.session.username
    res.render('testinomial.ejs',{username})
    
    
}

