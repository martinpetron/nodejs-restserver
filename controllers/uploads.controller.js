const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );

const { request, response } = require("express");
const { saveFile } = require('../helpers');
const { User, Product } = require('../models');
const { CLIENT_RENEG_LIMIT } = require('tls');


const uploadFile = async(req = request, res = response) => {
      
  //Subir archivo
  try {

    const filename = await saveFile( req.files, undefined, 'images' );
    res.json({ filename });

  } catch (msg) {
    res.status(400).json({ msg });
  }

  
}

const updateImg = async(req = request, res = response) => {

  const { id, collection } = req.params;

  let model; // uso let porque voy a establecer su valor de manera condicional

  switch ( collection ) {
    case "users":
      model = await User.findById( id );
      if ( !model ) {
        return res.status(500).json({ 
          msg: `User with ID ${ id } not found.`
        });
      }

    break;
    case "products":
      model = await Product.findById( id );
      if ( !model ) {
        return res.status(500).json({ 
          msg: `Product with ID ${ id } not found.`
        });
      }

    break;    
  
    default:
      return res.status(500).json({ msg: 'I forgot to validate this. '});
  }


  //Limpiar imagenes previas
  if ( model.img ) {
    //borrar img del server
    const imgPath = path.join( __dirname, '../uploads', collection, model.img );
    if ( fs.existsSync( imgPath ) ) {
      fs.unlinkSync( imgPath );
    }

  }

  //Subir archivo y Cargar archivo en BD
  try {

    const filename = await saveFile( req.files, undefined, collection ); //sube a FS
    model.img = filename;

    await model.save(); //guarda en BS
 
    res.json ( model );

  } catch (msg) {
    res.status(400).json({ msg });
  }
  

}

const updateImgCloudinary = async(req = request, res = response) => {

  const { id, collection } = req.params;

  let model; // uso let porque voy a establecer su valor de manera condicional

  switch ( collection ) {
    case "users":
      model = await User.findById( id );
      if ( !model ) {
        return res.status(500).json({ 
          msg: `User with ID ${ id } not found.`
        });
      }

    break;
    case "products":
      model = await Product.findById( id );
      if ( !model ) {
        return res.status(500).json({ 
          msg: `Product with ID ${ id } not found.`
        });
      }

    break;    
  
    default:
      return res.status(500).json({ msg: 'I forgot to validate this. '});
  }


  //Limpiar imagenes previas
  if ( model.img ) {
    //Obtengo Imagen ANTERIOR
    const nameArr = model.img.split('/'); //spliteo por /
    const name = nameArr[ nameArr.length - 1 ]; // busco la ultima posicion para obtener el nombrefile.jpg
    const [ public_id ] = name.split('.'); // spliteo por . y tomo la primer posicion.

    //borro de Cloudinary
    cloudinary.uploader.destroy( public_id );

  }

  //Subir archivo y Cargar archivo en BD
  // console.log( req.files.archivo ); //recupero el tempFilePath
  const  { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload( tempFilePath ); //el secure_url es lo que me interesa de la response.
  
  try {

    model.img = secure_url;
    await model.save(); //guarda en BS
 
   res.json ( model );

  } catch (msg) {
    res.status(400).json({ msg });
  }
  

}

const showImg = async(req = request, res = response) => {


  const { id, collection } = req.params;

  let model; // uso let porque voy a establecer su valor de manera condicional

  switch ( collection ) {
    case "users":
      model = await User.findById( id );
      if ( !model ) {
        return res.status(500).json({ 
          msg: `User with ID ${ id } not found.`
        });
      }

    break;
    case "products":
      model = await Product.findById( id );
      if ( !model ) {
        return res.status(500).json({ 
          msg: `Product with ID ${ id } not found.`
        });
      }

    break;    
  
    default:
      return res.status(500).json({ msg: 'I forgot to validate this. '});
  }

  if ( model.img ) {
    const imgPath = path.join( __dirname, '../uploads', collection, model.img );
    if ( fs.existsSync( imgPath ) ) {
      return res.sendFile( imgPath )
    }
  }  

  //Colocar NO-IMAGE por defecto.
  
  // res.json({ msg: 'Placeholder is missing. '}); 
  const noImgPath = path.join( __dirname, '../assets/no-image.jpg');
  if ( fs.existsSync( noImgPath ) ) {
    return res.sendFile( noImgPath )
  }

}

module.exports = {
    uploadFile,
    updateImg,
    updateImgCloudinary,
    showImg
}