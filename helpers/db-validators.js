const { Category, Product, Role, User } = require('../models');

//Es un rol valido
const isRoleValid = async(role = '') => {
    //me fijo si existe en la base de datos
    const existsRole = await Role.findOne({ role });
    if ( !existsRole ) {
            throw new Error(`Role ${ role } is not a valid Role`);
    }
}

//Es un email valido
const isEmailValid = async(email = '') => {
    //me fijo si existe en la base de datos
    const existsEmail = await User.findOne({ email });
    if ( existsEmail ) {
            throw new Error(`Email ${ email } is already registered.`);
    }
}

//Existe usuario por ID
const userExistsById = async( id ) => {
    const existsUser = await User.findById( id );
    if ( !existsUser ) {
            throw new Error(`User id ${ id } is not found.`);
    }
}

//Existe categoria por ID
const categoryExistsById = async( id ) => {
    const existsCategory = await Category.findById( id );
    if ( !existsCategory ) {
            throw new Error(`Category id ${ id } is not found.`);
    }
}

//Existe producto por ID
const productExistsById = async( id ) => {
    const existsProduct = await Product.findById( id );
    if ( !existsProduct ) {
            throw new Error(`Product id ${ id } is not found.`);
    }
}

//Colecciones permitidas
const allowedCollections = async( collection = '', collections = [] ) => {

    const included = collections.includes( collection );
    if ( !included ) {
        throw new Error(`Collection ${ collection } is not permited. Allowed collections are ${ collections }`);
    }

    return true;
}

module.exports = { 
    isRoleValid,
    isEmailValid,
    userExistsById,
    categoryExistsById,
    productExistsById,
    allowedCollections
 }