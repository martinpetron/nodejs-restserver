const path = require('path');
const { v4: uuidv4 } = require('uuid');

const saveFile = ( files, validExtensions = [ 'jpg', 'png', 'jpeg', 'gif'], directory = '' ) => {

    return new Promise( (resolve, reject) => {

        const { archivo } = files;

        //Obtener extension de archivo
        const splitedName = archivo.name.split('.');
        const extension = splitedName[ splitedName.length - 1];

        // Validar extension de archivo
        if ( !validExtensions.includes( extension ) ) {
           return reject(` Extension ${ extension } is not valid. Please use one of these: ${ validExtensions }.`)
        }
    
        //UPLOAD FILE
        const tempName = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', directory, tempName);
    
        archivo.mv(uploadPath, (err) => {
        if (err) {
            reject(err);
        }
    
        
        resolve( tempName );
        });

    });

}


module.exports = {
    saveFile
}