const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config.database');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.usersPath  = '/api/users';
        this.authPath   = '/api/auth';

        //Database connection
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Routes de mi aplicacion
        this.routes();
    }

    //Database
    async connectDB() {
        await dbConnection();
    }

    middlewares() {

        //CORS
        this.app.use( cors() );

        //lectura y parseo de Body
        this.app.use( express.json() );

        //Directorio Public
        this.app.use( express.static('public') );
    }

    routes() {

        this.app.use( this.authPath, require('../routes/auth.route'));
        this.app.use( this.usersPath, require('../routes/user.route'));
    }

    listen() {

        this.app.listen(this.port, () => {
            console.log( 'Running at port ', this.port );
        });
    }

}


module.exports = Server;