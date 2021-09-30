const { request, response } = require('express');

const validateUploadFile = ( req = request, res = response, next ) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: 'No files were uploaded. - key: archivo is needed (validateUploadFile)'
        });
      }

    next();
}



module.exports = {
    validateUploadFile
}