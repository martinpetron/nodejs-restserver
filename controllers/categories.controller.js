const { request, response } = require("express");
const { Category } = require('../models');

const getCategories = async (req = request, res = response) => {
    const { limit = 5, begin = 0 } = req.query;
    const query = { status: true }

    const [ total, categories ] = await Promise.all([
        Category.countDocuments( query ),
        Category.find( query )
            .populate( 'user','name' )  //relaciona tablas
            .skip(Number( begin ))
            .limit(Number( limit ))
    ]);

    res.json({
        total,
        categories
    });
}

//obtenerCategoria - populate
const getCategory = async (req = request, res = response) => {
    
    const { id } = req.params;
    const category = await Category.findById( id )
        .populate( 'user','name' );

    res.json( category );


}

//CREAR Categoria
const createCategory = async (req = request, res = response) => {

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if ( categoryDB ) {
        return res.status(400).json({
            msg: `Category ${ categoryDB.name }, is already registered.`
        });
    }

    // Generar la data a guardar
    const data = {
        name,
        user: req.user._id
    }

    //prepara todo para grabar
    const category = new Category( data );

    //Grabar DB
    await category.save();

    res.status(201).json(category);

}


//actualizarCategoria nombre, que no exista etc
const updateCategory = async (req = request, res = response) => {
    
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate( id, data, {new: true} ); //new:true es para que me mande la respuesta actualizada

    res.json( category );

}

//borrarCategoria estadofalse necesito id validar y tal.
const deleteCategory = async (req = request, res = response) => {
    const { id } = req.params;
    const uid = req.uid;
    // "Borrado" del Category, en realidad es un update al campo status
    const category = await Category.findByIdAndUpdate ( id, { status: false } , { new: true });
    
    res.json({
        category
        // ,userAuth
    });    
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}