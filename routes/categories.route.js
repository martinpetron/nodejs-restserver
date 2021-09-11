const { Router, request, response } = require('express');
const { check } = require('express-validator');
const { createCategory,
        getCategories, 
        deleteCategory,
        updateCategory,
        getCategory} = require('../controllers/categories.controller');
const { categoryExistsById, isRoleValid } = require('../helpers/db-validators');
const { validateFields, 
        validateJWT, 
        hasRole} = require('../middlewares');

const router = Router();


//Obtener todas las categorias
router.get('/', getCategories );


//Obtener una categoria por id
router.get('/:id', [
    check('id', 'Is not a Valid ID').isMongoId(),
    check('id').custom( categoryExistsById ),
    validateFields
] ,getCategory);


//Crear categoria
router.post('/', [ 
    validateJWT,
    check('name','Name is required').not().isEmpty(),
    validateFields
], createCategory );


//Actualizar una categoria por id
router.put('/:id',[
    validateJWT,
    check('name','Name is required').not().isEmpty(),
    check('id').custom( categoryExistsById ),
    check('id', 'Is not a Valid ID').isMongoId(),
    // check('role').custom( isRoleValid ),
    validateFields
], updateCategory );


//Delete categoria
router.delete('/:id',[
    validateJWT,
    hasRole('ADMIN_ROLE', 'DELETE_ROLE'),
    check('id', 'Is not a Valid ID').isMongoId(),
    check('id').custom( categoryExistsById ),
    validateFields
], deleteCategory );

module.exports = router;