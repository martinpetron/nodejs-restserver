const { Router } = require('express');
const { check } = require('express-validator');

// const { validateFields } = require('../middlewares/validate-fields');
// const { validateJWT } = require('../middlewares/validate-jwt');
// const { isAdminRole, hasRole } = require('../middlewares/validate-roles');
const { validateFields,
        validateJWT,
        isAdminRole,
        hasRole} = require('../middlewares');

const { isRoleValid, isEmailValid, userExistsById } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPost,
        usuariosPut,
        usuariosPatch,
        usuariosDelete } = require('../controllers/users.controller');

const router = Router();

//Get Users - paginado
router.get('/', usuariosGet );

//Create User
router.post('/',[       //array de Middlewares
        check('name','Name is required').not().isEmpty(),
        check('password','Password is required').not().isEmpty(),
        check('password','Password must have more than 6 characters').isLength({ min: 6 }),
        check('email','Email is not in a valid format').isEmail(),
        check('email').custom( isEmailValid ),
        // check('role','Is not a valid role').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('role').custom( isRoleValid ), // se puede obviar esto --> check('role').custom( (role) => isValidRole(role) ),
        validateFields  
],usuariosPost );

//Update User
router.put('/:id',[
        check('id', 'Is not a Valid ID').isMongoId(),
        check('id').custom( userExistsById ),
        check('role').custom( isRoleValid ),
        validateFields
], usuariosPut );

router.patch('/', usuariosPatch );

//Delete User
router.delete('/:id',[
        validateJWT,
        // isAdminRole,
        hasRole('ADMIN_ROLE', 'DELETE_ROLE'),
        check('id', 'Is not a Valid ID').isMongoId(),
        check('id').custom( userExistsById ),
        validateFields
], usuariosDelete );




module.exports = router;