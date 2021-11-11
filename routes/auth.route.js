const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin, renewToken } = require('../controllers/auth.controller');
const { validateFields, validateJWT } = require('../middlewares');

const router = Router();

//Login
router.post( '/login',[
    check('email','Email is required').not().isEmpty(),
    check('email','Email is not in a valid format').isEmail(),
    check('password','Password is required').not().isEmpty(),
    validateFields
], login );

//Google SignIn
router.post( '/google',[
    check('id_token','id_token is required').not().isEmpty(),
    validateFields
], googleSignin );

//Google SignIn
router.get( '/',validateJWT, renewToken );

module.exports = router;