const {tokenAuthorization,tokenAuthorizationOnlyAdmin} = require('../controllers/verifyToken')
const Product = require('../models/Products.js')


const postProduct = async (req,res)=>{
    try {
        
        const savedProduct = await Product.create(req.body) 
        res.status(201).json(savedProduct)
    } catch (error) {
        res.status(500).json({msg:error})
    }
    
}

const putProduct = async (req,res)=>{
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            {id : req.params.id},
            {
                $set : req.body
            },
            {new:true}
        );
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json({msg:error})
    }
}
const deleteProduct = async (req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("product has been deleted")
    } catch (error) {
        res.status(500).json({msg:error})
    }
    
}

const getProduct = async (req ,res )=>{
    try {
        const product = Product.findById(req.params.id)
        if(!product){
            return res.status(401).json("product doesnot exist")
        }   
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({msg:error})
    }
}


const getAllProducts = async (req,res) =>{
    try {
        const allProducts = await Product.find()
        res.status(200).json(allProducts)
    } catch (error) {
        res.status(500).json({msg:error})
    }
 }
module.exports = {
    postProduct,
    putProduct,
    deleteProduct,
    getProduct,
    getAllProducts
}