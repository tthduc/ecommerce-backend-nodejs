'use strict';

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

// Declare the Schema of the Mongo model
var inventorySchema = new mongoose.Schema({
    inven_productId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Product',
    },
    inven_location:{
        type:String,
        default:'VN'
    },
    inven_shopId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Shop',
    },
    inven_stock:{
        type:Number,
        required:true,
    },
    inven_sold:{
        type:Number,
        default:0
    },
    inven_reservation:{
        type:Array,
        default:[]
    }
},{
    timestamps:true,
    collection:COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, inventorySchema);
