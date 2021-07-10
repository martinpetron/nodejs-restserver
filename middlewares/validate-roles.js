const { response, request } = require('express');


const isAdminRole = ( req = request , res = response , next ) => {

    if (!req.user) {
       return res.status(500).json({
           msg: 'Trying to verify role without token validation first.'
       });
    }

    const { role, name } = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg:`${ name } is not Administrator - Operation not allowed.`
        });
    }

    next();
}


const hasRole = ( ...roles ) => {
    return (req = request , res = response , next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: 'Trying to verify role without token validation first.'
            });
         }

         if ( !roles.includes( req.user.role ) ) {
             return res.status(401).json({
                msg:`One of these roles: ${ roles } is required to perform this action.`
             })
         }

        next();
    }
}

module.exports = {
    isAdminRole,
    hasRole
}