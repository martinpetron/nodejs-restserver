const { Schema, model } = require('mongoose');

const UserSchema = Schema ({

    name: {
        type: String,
        required: [true, 'Name is required'], //si no lo pone, le envio el mensaje NAME IS REQUIRED
    },
    email: {
        type: String,
        required: [true, 'Email is required'], //si no lo pone, le envio el mensaje NAME IS REQUIRED
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'], //si no lo pone, le envio el mensaje NAME IS REQUIRED
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE'] //Valida que lo que se cargue este dentro de estas opciones
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


//Sobreescribo el metodo toJSON para que no retorne los campos "__v" ni "password"  
UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    //Cambio el naming _id por uid
    user.uid = _id;
    return user;
};

module.exports = model( 'User', UserSchema );