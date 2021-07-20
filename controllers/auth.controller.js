const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user.model');

const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignin = async (req = request, res = response) => {

  const { id_token } = req.body;

  try {

    const {name, img, email } = await googleVerify( id_token );
    let user = await User.findOne({ email });

    if ( !user ) {
      //Crear usuario
      console.log('if create user');
      const data = {
        name,
        email,
        img,
        google: true,
        password:'clave_standard'
      };

      console.log('user save');
      user = new User( data );
      await user.save();
    }

    //Si el usuario en DB
    if ( !user.status ) {
      return res.status(401).json({
        msg: 'Contact administrator, blocked user'
      });

    }

    //Generar JWT
    const token = await generateJWT( user.id );


    res.json({
      user,
      token
    });

  } catch (error) {
    res.status(400).json({
      msg: 'Google token is not valid.'
    })
  }

}

module.exports = {
    login,
    googleSignin
  };