const express = require('express')
const cors = require('cors')

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users';

        //Middlewares
        this.middlewares();

        //Routes de mi aplicacion
        this.routes();
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

        this.app.use( this.usersPath, require('../routes/user.route'));
    }

    listen() {

        this.app.listen(this.port, () => {
            console.log( 'Running at port ', this.port );
        });
    }

}


module.exports = Server;