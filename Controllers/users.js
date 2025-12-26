
const User = require('../models/User')
const updateUser = async (req , res , next) =>{

    try {
        const updatedUser = await User.findOneAndUpdate(
            {_id:req.params.id},
            {
                $set:req.body,
            },
            {new:true} // 3l4an yreturn updateduser
        ) 
        const {password , ...others} = updatedUser._doc;
        res.status(200).json({...others })
        
    } catch (error) {
        res.status(500).json('8alat')
    }
}
const deleteUser = async( req ,res) =>{
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json('user has been deleted')
        
    } catch (error) {
        res.status(500).json(error)
        
    }
}
const getUser = async(req ,res)=>{
    
    try {
        const user = await User.findById(req.params.id)
        const {password,...others} = user._doc
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error)
    }
}
const getAllUsers = async(req,res)=>{
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({msg:error});
    }
}


module.exports = {
    updateUser,
    deleteUser,
    getUser,
    getAllUsers,

}
