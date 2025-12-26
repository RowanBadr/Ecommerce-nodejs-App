const router = require('express').Router();
const {tokenAuthorization,tokenAuthorizationOnlyAdmin} = require('../controllers/verifyToken')
const {putOrder , deleteOrder ,postOrder , getOrder , getAllOrders} = require('../controllers/order')

router.route('/:id')
.put(tokenAuthorizationOnlyAdmin,putOrder)
.delete(tokenAuthorizationOnlyAdmin,deleteOrder)
.post(tokenAuthorization,postOrder)
.get(tokenAuthorization,getOrder);
router.route('/').get(tokenAuthorizationOnlyAdmin,getAllOrders)

module.exports = router;