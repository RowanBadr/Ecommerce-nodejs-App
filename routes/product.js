const router = require('express').Router();
const {tokenAuthorization,tokenAuthorizationOnlyAdmin} = require('../controllers/verifyToken')
const {postProduct, putProduct, deleteProduct, getProduct,getAllProducts} = require('../controllers/product')

router.route('/')
.post(tokenAuthorizationOnlyAdmin , postProduct)
.get(tokenAuthorization , getAllProducts)
router.route('/:id')
.put(tokenAuthorizationOnlyAdmin,putProduct)
.delete(tokenAuthorizationOnlyAdmin,deleteProduct)
.get(tokenAuthorization,getProduct)
module.exports = router;