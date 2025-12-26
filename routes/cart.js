const router = require('express').Router();
const {tokenAuthorization,tokenAuthorizationOnlyAdmin} = require('../controllers/verifyToken')
const {putCart , deleteCart , postCart , getCart , getAllCarts} = require('../controllers/cart')

router.route('/:id')
.put(tokenAuthorization,putCart)
.delete(tokenAuthorization,deleteCart)
.post(tokenAuthorization,postCart)
.get(tokenAuthorization,getCart)
router.route('/').get(tokenAuthorizationOnlyAdmin,getAllCarts)
module.exports = router;