import mongoose, { Schema, model } from "mongoose";

const productSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique:true
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    stock:{
        type: Number,
        required: true  
    }
},
{
    timestamps: true
  })

export default model('Product', productSchema)