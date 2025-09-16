'use strict';

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema({
    discount_name:{
        type:String,
        required:true,
    },
    discount_description:{
        type:String,
        required:true,
    },
    discount_type:{
        type:String,
        default:'fixed' // fixed | percentage
    },
    discount_value:{
        type:Number,
        required:true,
    },
    discount_code:{
        type:String,
        required:true,
        unique:true,
    },
    discount_startDate:{
        type:Date,
        required:true,
    },
    discount_endDate:{
        type:Date,
        required:true,
    },
    discount_shopId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Shop',
    },
    discount_applied_products:{ // danh sach san pham ap dung
        type:String,
        required:true,
        enum:['all','specific','exclude']
    },
    discount_productIds:{ // chi ap dung cho nhung san pham co trong danh sach
        type:Array,
        default:[]
    },
    discount_max_usage:{ // so lan su dung toi da
        type:Number,
        required:true,
    },
    discount_used_count:{ // so lan da su dung cua discount
        type:Number,
        default:0
    },
    discount_used_by:{ // danh sach user da su dung
        type:Array,
        default:[]
    },
    discount_max_uses_per_user:{ // so lan su dung toi da cua 1 user
        type:Number,
        required:true,
    },
    discount_min_order_value:{ // gia tri don hang toi thieu de ap dung ma giam gia
        type:Number,
        required:true,
    },
    discount_isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    collection:COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);
