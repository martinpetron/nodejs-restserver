const { Router, request, response } = require('express');
const { check } = require('express-validator');
const { createProduct,
        getProducts, 
        deleteProduct,
        updateProduct,
        getProduct} = require('../controllers/products.controller');
const { productExistsById, isRoleValid, categoryExistsById } = require('../helpers/db-validators');
const { validateFields, 
        validateJWT, 
        hasRole} = require('../middlewares');

const router = Router();


//Obtener todas las categorias
router.get('/', getProducts );


//Obtener una categoria por id
router.get('/:id', [
    check('id', 'Is not a Valid ID').isMongoId(),
    check('id').custom( productExistsById ),
    validateFields
] ,getProduct);


//Crear categoria
router.post('/', [ 
    validateJWT,
    check('name','Name is required').not().isEmpty(),
    check('category', 'Is not a Valid ID').isMongoId(),
    check('category').custom( categoryExistsById ),
    validateFields
], createProduct );


//Actualizar una categoria por id
router.put('/:id',[
    validateJWT,
    check('id', 'Is not a Valid ID').isMongoId(),
    check('id').custom( productExistsById ),
    // check('role').custom( isRoleValid ),
    validateFields
], updateProduct );


//Delete categoria
router.delete('/:id',[
    validateJWT,
    hasRole('ADMIN_ROLE', 'DELETE_ROLE'),
    check('id', 'Is not a Valid ID').isMongoId(),
    check('id').custom( productExistsById ),
    validateFields
], deleteProduct );

module.exports = router;