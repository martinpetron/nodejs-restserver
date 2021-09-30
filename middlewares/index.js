const validateFields    = require('../middlewares/validate-fields');
const validateJWT       = require('../middlewares/validate-jwt');
const validateRoles     = require('../middlewares/validate-roles');
const validateUploadFile = require('../middlewares/validate-uploadfile');


module.exports = {
    ...validateFields,
    ...validateJWT,
    ...validateRoles,
    ...validateUploadFile
}