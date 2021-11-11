const { Socket } = require('socket.io');
const { checkJWT } = require('../helpers');
const { Chat } = require('../models');

const chat = new Chat();

const socketController = async ( socket =  new Socket(), io  ) => { //TODO: Eliminar ....'new Socket()' solo se deja para ayudar a desarrollar en js

    
    const token = socket.handshake.headers['x-token'];
    const user = await checkJWT(token);

    if (!user) {
        return socket.disconnect();
    }

    // console.log( 'Client connected', user.name );

    //Agregar el usuario conectado
    chat.connectUser(user);
    io.emit('active-users', chat.usersArr); //emito a todo el mundo
    socket.emit('receive-messages', chat.last10 ); //envio solo a ese usuario

    //Conectarlo a una sala especial
    socket.join(user.id); //global, socket.id, usuario.id -  3 SALAS


    //Limpiar cuando un usuario se desconecta
    socket.on('disconnect', () =>{
        chat.disconnectUser(user.id);
        io.emit('active-users', chat.usersArr);
    })


    socket.on('send-message',({ uid, message }) => {
        
        if (uid) {
            //mensaje privado
            socket.to(uid).emit('private-message', { from: user.name, message})

        } else {
            //mensaje publico
            chat.sendMessage(user.id, user.name, message);
            io.emit('receive-messages', chat.last10 );
            
        }



    })

};



module.exports = {
    socketController
};