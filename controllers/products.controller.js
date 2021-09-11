const { request, response } = require("express");
const { Product } = require('../models');

const getProducts = async (req = request, res = response) => {
    const { limit = 5, begin = 0 } = req.query;
    const query = { status: true }

    const [ total, products ] = await Promise.all([
        Product.countDocuments( query ),
        Product.find( query )
            .populate( 'user','name' )  //relaciona tablas
            .populate( 'category','name' )  //relaciona tablas
            .skip(Number( begin ))
            .limit(Number( limit ))
    ]);

    res.json({
        total,
        products
    });
}

//obtenerCategoria - populate
const getProduct = async (req = request, res = response) => {
    
    const { id } = req.params;
    const product = await Product.findById( id )
        .populate( 'user','name' )
        .populate( 'category','name' );

    res.json( product );


}

//CREAR Categoria
const createProduct = async (req = request, res = response) => {


    const { status, user, ...body } = req.body; //evito que me creen algo con un status y un usuario en particular

    const productDB = await Product.findOne({ name: body.name.toUpperCase() });

    if ( productDB ) {
        return res.status(400).json({
            msg: `Product ${ productDB.name }, is already registered.`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id
    }

    //prepara todo para grabar
    const product = new Product( data );

    //Grabar DB
    await product.save();

    res.status(201).json(product);

}


//actualizarCategoria nombre, que no exista etc
const updateProduct = async (req = request, res = response) => {
    
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    if( data.name ) {
        data.name = data.name.toUpperCase();
    }
    
    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate( id, data, {new: true} ); //new:true es para que me mande la respuesta actualizada

    res.json( product );

}

//borrarCategoria estadofalse necesito id validar y tal.
const deleteProduct = async (req = request, res = response) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate ( id, { status: false } , { new: true });
    
    res.json( product );    
}

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}