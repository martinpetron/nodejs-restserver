const dbValidators  = require('./db-validators');
const generateJWT   = require('./generate-jwt');
const googleVerify  = require('./google-verify');
const saveFile    = require('./saveFile');

module.exports = {
    ...dbValidators,
    ...generateJWT,
    ...googleVerify,
    ...saveFile
}