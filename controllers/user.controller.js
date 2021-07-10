const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user.model');


const usuariosGet = async(req = request, res = response) => {

    const { limit = 5, begin = 0 } = req.query;
    const query = { status: true }

    const [ total, users ] = await Promise.all([
        User.countDocuments( query ),
        User.find( query )
            .skip(Number( begin ))
            .limit(Number( limit ))
    ]);

    res.json({
        total,
        users
    });
  }

const usuariosPost = async(req, res = response) => { 
    
    const { name, email, password, role } = req.body; //  const body = req.body; //SIEMPRE DESESTRUCTURAR EL body por seguridad

    //Instanciar un usuario
    const user = new User( { name, email, password, role } );

    //Encriptar password 
    const salt = bcryptjs.genSaltSync(10); //- hago un salt (antidad de vueltas que quiero que encrripte el pwd, a > mas seguro, pero mas lento.)
    user.password = bcryptjs.hashSync( password, salt);//genero el hash, pasandole el pwd y el salt que arme

    //Guardar en la base de datos
    await user.save();

    res.status(201).json({
        user
    });
}

  const usuariosPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, status, password, google, email, ...others } = req.body;

    if ( password ) {
        //Encriptar password 
        const salt = bcryptjs.genSaltSync(10);
        others.password = bcryptjs.hashSync( password, salt);
    }

    const user = await User.findByIdAndUpdate( id, others );

    res.json({
        user //TODO me trae lo viejo, previo al update y no lo updateado.. 
    });
}


const usuariosPatch = (req, res = response) => {
    res.json({
        msg:'patch API - Controller'
    });
}


const usuariosDelete = async(req, res = response) => {
    const { id } = req.params;
    const uid = req.uid;
    // Borrado FISICO de la DB
    // const user = await User.findByIdAndDelete ( id );

    // "Borrado" del user, en realidad es un update al campo status
    const user = await User.findByIdAndUpdate ( id, { status: false });
    
    //Traigo la info del usuario autenticado en el middleware
    // const userAuth = req.user;


    res.json({
        user
        // ,userAuth
    });
}


  module.exports = {
      usuariosGet,
      usuariosPost,
      usuariosPut,
      usuariosPatch,
      usuariosDelete
  };