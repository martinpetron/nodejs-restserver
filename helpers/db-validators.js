const Role = require('../models/role.model');
const User = require('../models/user.model');

const isRoleValid = async(role = '') => {
    //me fijo si existe en la base de datos
    const existsRole = await Role.findOne({ role });
    if ( !existsRole ) {
            throw new Error(`Role ${ role } is not a valid Role`);
    }
}

const isEmailValid = async(email = '') => {
    //me fijo si existe en la base de datos
    const existsEmail = await User.findOne({ email });
    if ( existsEmail ) {
            throw new Error(`Email ${ email } is already registered.`);
    }
}

const userExistsById = async( id ) => {
    const existsUser = await User.findById( id );
    if ( !existsUser ) {
            throw new Error(`Id ${ id } is not found.`);
    }
}


module.exports = { 
    isRoleValid,
    isEmailValid,
    userExistsById
 }