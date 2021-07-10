const { validationResult } = require('express-validator');


const validateFields = ( req, res, next ) => {

    //traigo los errores de los middleware definidos en la route y los analizo.
    const errors = validationResult(req);
    if ( !errors.isEmpty() ) {
        return res.status(400).json(errors)
    }

    next();
}



module.exports = {
    validateFields
}