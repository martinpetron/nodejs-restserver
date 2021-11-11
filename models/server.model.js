const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { dbConnection } = require('../database/config.database');
const { socketController } = require('../sockets/controller');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer( this.app );
        this.io = require('socket.io')(this.server);


        this.paths = {
           auth:        '/api/auth' ,
           categories:  '/api/categories',
           products:    '/api/products',
           search:      '/api/search',
           uploads:     '/api/uploads',
           users:       '/api/users'           
        }

        //Database connection
        this.connectDB();

        //Middlewares
        this.middlewares();

        //Routes de mi aplicacion
        this.routes();

        //Sockets
        this.sockets();
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

        // FileUpload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true //PERMITE CREAR DIRECTORIOS AUTOMATICAMENTE
        }));
    }

    routes() {

        this.app.use( this.paths.auth, require('../routes/auth.route'));
        this.app.use( this.paths.categories, require('../routes/categories.route'));
        this.app.use( this.paths.products, require('../routes/products.route'));
        this.app.use( this.paths.search, require('../routes/search.route'));
        this.app.use( this.paths.uploads, require('../routes/uploads.route'));
        this.app.use( this.paths.users, require('../routes/users.route'));
    }

    sockets() {
        this.io.on( 'connection', (socket) => socketController(socket, this.io) );
    }

    listen() {

        this.server.listen(this.port, () => {
            console.log( 'Running at port ', this.port );
        });
    }

}


module.exports = Server;