const router = require('express').Router();
const {updateUser , deleteUser , getUser , getAllUsers} = require('../controllers/users')
const {tokenAuthorization,tokenAuthorizationOnlyAdmin} = require('../controllers/verifyToken')

router.route('/:id')
.put(tokenAuthorization , updateUser)
.delete(tokenAuthorization,deleteUser)
.get(tokenAuthorizationOnlyAdmin,getUser)
router.route('/').get(tokenAuthorizationOnlyAdmin,getAllUsers)


module.exports = router;