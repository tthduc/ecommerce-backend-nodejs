'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  product_thumb: { type: String, required: true },
  product_description: { type: String },
  product_price: { type: Number, required: true },
  product_quantity: { type: Number, required: true },
  product_type: { type: String, required: true, enum: ['Clothing', 'accessories', 'Electronics'] },
  product_attributes: { type: Schema.Types.Mixed, required: true },
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

// define product type = clothing
const clothingSchema = new Schema({
    brand: {type: String, required: true},
    size: {type: String, required: true},
    color: {type: String, required: true},
    material: {type: String, required: true}
}, {
    collection: 'clothes',
    timestamps: true
})

// define product type = electronics
const electronicsSchema = new Schema({
    manufacturer: {type: String, required: true},
    model: {type: String, required: true},
    color: {type: String, required: true},
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop', required: true}
}, {
    collection: 'electronics',
    timestamps: true
})

// define product type = furniture
const furnitureSchema = new Schema({
    brand: {type: String, required: true},
    material: {type: String, required: true},
    size: {type: String, required: true},
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop', required: true}
}, {
    collection: 'furnitures',
    timestamps: true
})

module.exports = {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    clothing: mongoose.model('Clothing', clothingSchema),
    electronics: mongoose.model('Electronics', electronicsSchema),
    furniture: mongoose.model('Furniture', furnitureSchema)
}
