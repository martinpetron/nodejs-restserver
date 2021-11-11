const jwt = require('jsonwebtoken');
const { User } = require('../models');



const generateJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, ( err, token ) =>{
                if (err) {
                    console.log(err);
                    reject ( 'JWT not be generated' );
                } else {
                    resolve( token );
                }

            })

    })

}


const checkJWT = async ( token = '' ) => {

    try {
        if (token.length < 10 ) {
            return null;
        }

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const user = await User.findById( uid );
        
        if (user) {
            if (user.status) {
                return user;   
            } else {
                return null;
            }
        } else {
            return null;            
        }


    } catch (error) {
        return null;
    }

}


module.exports = {
    generateJWT,
    checkJWT
}