const User = require('../models/User.js')// ezay user u small not u capital ??

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const postRegister = async (req, res) => {
    try {
        const { name, password } = req.body; 
        
        const findUser = await User.findOne({ name: name }); 
        if (findUser) { 
            return res.status(400).json({ msg: "The username is taken" }); 
        }
        const hashedPassword = await bcrypt.hash(password, 10); 
        const savedUser = await User.create({ name: name, password: hashedPassword });

        const {password:savedPassword , ...others} = savedUser._doc
        res.status(200).json({...others})
    } catch (error) {
        res.status(500).json({ msg: error.message }); 
    }
};

const postLogin = async (req,res)=>{
    try {
        const {name , password} = req.body
        const user = await User.findOne({name});
        console.log(user)
        if (!user) { 
            console.log("no user")
            return res.status(400).json({ msg: "Wrong username or password" }); 
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const passwordMatch = await bcrypt.compare(password,hashedPassword)
        if(passwordMatch) {
            const accessToken = jwt.sign(
            {   
            id:user._id,
            isAdmin:user.isAdmin,
            },
            process.env.JWT_ACCESS_TOKEN ,
            {expiresIn:'3d'}
        );
        
        // to not show password when return
        const {password , ...others} = user._doc;
        console.log(User._doc)
        res.status(200).json({...others , accessToken})
        }
        else {
            res.status(400).json({msg:'Wrong username or password'})
        }
    } catch (error) {
        res.status(500).json({msg:'internal server error'})
    }
}

module.exports = {
    postRegister,
    postLogin,

}