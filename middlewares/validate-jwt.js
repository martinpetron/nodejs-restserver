const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

const validateJWT = async( req = request , res = response , next ) => {

    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            msg:'No token in the request'
        });
    }


    try {
        
        //Verifica el JWT
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        
        //Leer el usuario (autenticado) que corresponde al uid
        const user = await User.findById( uid );
        if (!user) {
            return res.status(401).json({
                msg:'Invalid token - User not exists in DB'
            });            
        }

        //verificar si el uid  tiene status: true
        if ( !user.status ) {
            return res.status(401).json({
                msg:'Invalid token - user status:false'
            });
        } 



        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:'Invalid token'
        })
    }

}



module.exports = {
    validateJWT
}