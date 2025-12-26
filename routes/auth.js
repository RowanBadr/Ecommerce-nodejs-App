const router = require('express').Router();
const {postRegister,postLogin} = require('../controllers/auth')

router.route('/signup').post(postRegister);
router.route('/login').post(postLogin);

module.exports = router;