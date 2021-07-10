const { Schema, model } = require('mongoose');

const RoleSchema = Schema ({

    role: {
        type: String,
        required: [true, 'Role is required'], //si no lo pone, le envio el mensaje NAME IS REQUIRED
    }
});


module.exports = model( 'Role', RoleSchema );