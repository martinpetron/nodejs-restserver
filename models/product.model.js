const { Schema, model } = require('mongoose');

const ProductSchema = Schema ({

    name: {
        type: String,
        required: [true, 'Product name is required'], 
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
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description : { type: String },
    available : { type: Boolean, default: true },
    img : { type: String }
});

//Sobreescribo el metodo toJSON para que no retorne los campos "__v" ni "status"  
ProductSchema.methods.toJSON = function() {
    const { __v, status, ...data } = this.toObject();
    return data;
};

module.exports = model( 'Product', ProductSchema );