const { Router } = require('express');
const { check } = require('express-validator');

const { uploadFile, updateImg, updateImgCloudinary, showImg, showImgCloudinary } = require('../controllers/uploads.controller');
const { allowedCollections } = require('../helpers');
const { validateFields, validateUploadFile } = require('../middlewares');

const router = Router();

//Crear nuevo recurso en el servidor
router.post('/', validateUploadFile, uploadFile );

//Actualizar imagen
router.put('/:collection/:id', [
    validateUploadFile,
    check('id', 'Is not a Valid ID').isMongoId(),
    check('collection').custom( c => allowedCollections( c, ['users','products' ] ) ),
    validateFields
], updateImgCloudinary );    
// ], updateImg );

//GET
router.get('/:collection/:id', [
    check('id', 'Is not a Valid ID').isMongoId(),
    check('collection').custom( c => allowedCollections( c, ['users','products' ] ) ),
    validateFields
], showImgCloudinary );
// ], showImg );

module.exports = router;