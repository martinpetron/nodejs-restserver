const { Category, Product, Role, User } = require('../models');

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
            throw new Error(`User id ${ id } is not found.`);
    }
}

const categoryExistsById = async( id ) => {
    const existsCategory = await Category.findById( id );
    if ( !existsCategory ) {
            throw new Error(`Category id ${ id } is not found.`);
    }
}

const productExistsById = async( id ) => {
    const existsProduct = await Product.findById( id );
    if ( !existsProduct ) {
            throw new Error(`Product id ${ id } is not found.`);
    }
}

module.exports = { 
    isRoleValid,
    isEmailValid,
    userExistsById,
    categoryExistsById,
    productExistsById
 }