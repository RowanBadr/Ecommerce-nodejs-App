const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next)=>{
    
    const authHeader = req.headers.token;
    // token is sent in header
    // verfiy token from header
    if(authHeader) {
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err,user)=> {
            if(err){
                res.status(403).json("Token is not valid")   
            }
            req.user = user;
            next()
        })
        
    } else {
        return res.status(401).json({msg:"Token may be wrong or experied"})
    }
}

const tokenAuthorization = (req , res , next) =>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin) {
            
            next()
        } else {
            res.status(403).json("You are allowed to access")   
            
        }
    })
}
const tokenAuthorizationOnlyAdmin = (req , res , next) =>{
    verifyToken(req,res,()=>{
        
        if(req.user.isAdmin) { 
            next()
        } else {
            res.status(403).json("You are not an admin")   
            
        }
    })
}
module.exports = {  
    verifyToken,
    tokenAuthorization,
    tokenAuthorizationOnlyAdmin
}