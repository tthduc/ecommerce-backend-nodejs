'use strict';

//!mdbgum
const mongoose = require('mongoose');
const { Schema } = mongoose;

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        maxlength: 100
    },
    email:{
        type:String,
        trim: true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    // Enable timestamps for createdAt and updatedAt fields
    timestamps: true,

    // Use the Shops collection
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
