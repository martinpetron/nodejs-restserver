const { Schema, model } = require('mongoose');

const CategorySchema = Schema ({

    name: {
        type: String,
        required: [true, 'Category name is required'], 
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,        //Asi se hacen las relaciones entre modelos.
        ref: 'User',                        //tiene que coincidir exactamente con el modelo que quiero relacionar
        required: true
    }
});

//Sobreescribo el metodo toJSON para que no retorne los campos "__v" ni "status"  
CategorySchema.methods.toJSON = function() {
    const { __v, status, ...data } = this.toObject();
    return data;
};

module.exports = model( 'Category', CategorySchema );