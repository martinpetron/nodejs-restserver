const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        
        //conexion a mongo, los parametros esos se ponen asi siempre, no se porque.
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('***** Database ONLINE *****');

    } catch (error) {
        console.log(error);
        throw new Error('***** Error on initializing database *****');
    }

}



module.exports = {
    dbConnection
}