const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Category, Product, User } = require('../models');

const collectionsAllowed = [
    'categories',
    'products',
    'roles',
    'users'
];

const searchCategory = async ( term = '' , res = response ) => {

    const isMongoId = ObjectId.isValid( term ); //TRUE

    if ( isMongoId ) {
        const category = await Category.findById(term);
        return res.json({
            results: ( category ) ? [ category ] : [] // chequeo el usuario, si existe lo muestro, si no retorno un array vacio.
        });
    }
    
    const regexp = new RegExp( term, 'i') ;
    const categories = await Category.find({ name: regexp , status: true });

    res.json({
        results: categories
    });

}

const searchProduct = async ( term = '' , res = response ) => {

    const isMongoId = ObjectId.isValid( term ); //TRUE

    if ( isMongoId ) {
        const product = await Product.findById(term)
                                .populate('category','name') //popula con la info de la otra tabla relacionada.
                                .populate('user','name'); //popula con la info de la otra tabla relacionada.
        return res.json({
            results: ( product ) ? [ product ] : [] // chequeo el usuario, si existe lo muestro, si no retorno un array vacio.
        });
    }
    
    const regexp = new RegExp( term, 'i') ;
    const products = await Product.find({ name: regexp , status: true })
                        .populate('category','name') //popula con la info de la otra tabla relacionada.
                        .populate('user','name'); //popula con la info de la otra tabla relacionada.

    res.json({
        results: products
    });

}

const searchUser = async ( term = '' , res = response ) => {

    const isMongoId = ObjectId.isValid( term ); //TRUE

    if ( isMongoId ) {
        const user = await User.findById(term);
        return res.json({
            results: ( user ) ? [ user ] : [] // chequeo el usuario, si existe lo muestro, si no retorno un array vacio.
        });
    }
    
    const regexp = new RegExp( term, 'i') ;
    const users = await User.find({ 
        $or: [{ name: regexp },{ email: regexp }],
        $and: [{ status: true }]
     });

    res.json({
        results: users
    });

}


const search = (req = request, res = response) => {

    const { collection, term } = req.params;

    if ( !collectionsAllowed.includes( collection ) ) {
        return res.status(400).json({
            msg: `Allowed collections are: ${ collectionsAllowed }`
        })
    }

    switch (collection) {
        case 'categories':
            searchCategory(term, res);

        break;
        case 'products':
            searchProduct(term, res);

        break;
        case 'users':
            searchUser(term, res);
        break;

        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
    }

}


module.exports = {
    search
};