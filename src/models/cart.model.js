'use strict';

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const mongoose = require('mongoose'); // Erase if already required

const cartSchema = new mongoose.Schema({
    cart_status:{
        type:String,
        required:true,
        enum:['active','completed','failed','pending'],
        default:'active'
    },
    cart_products:{
        /**
         * [
         *  {
         *      productId: 'ObjectId',
         *      quantity: Number,
         *      price: Number
         *  }
         * ]
         */
        type:Array,
        required:true,
        default:[]
    },
    cart_count_products:{
        type:Number,
        required:true,
        default:0
    },
    cart_userId:{
        type:Number,
        required:true,
    },
},{ 
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, cartSchema, COLLECTION_NAME);