const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user.model');

const { generateJWT } = require('../helpers/generate-jwt');

const login = async(req = request, res = response) => {

  const { email, password } = req.body;

  try {
    
    //Verificar si email exite
    const user = await  User.findOne({ email });
    if ( !user ) {
      res.status(400).json({
        msg:'User and/or Password are not correct. - email'
      });
    }

    //Verificar si el usuario esta activo
    if ( !user.status ) {
      res.status(400).json({
        msg:'User and/or Password are not correct. - status: false'
      });
    }

    //Verificar el password
    const validPassword = bcryptjs.compareSync( password, user.password );
    if ( !validPassword ) {
      res.status(400).json({
        msg:'User and/or Password are not correct. - password'
      });
    }

    //Generar JWT
    const token = await generateJWT( user.id );

    res.json({
      user,
      token
    });


  } catch (error) {
    
    console.log(error)
    return res.status(500).json({
      msg:'ERROR - Contact the administrator'
    })

  }


  }

  module.exports = {
      login
    };