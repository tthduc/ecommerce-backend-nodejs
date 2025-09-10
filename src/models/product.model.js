'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_slug: { type: String, unique: true },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Clothing', 'accessories', 'Electronics'] },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    product_ratingsAverage: { 
        type: Number, 
        default: 4.5, 
        min: [1, 'Rating must be above 1.0'], 
        max: [5, 'Rating must be below 5.0'], 
        set: val => Math.round(val * 10) / 10 
    },
    product_variations: [{ type: Array, default: [] }],
    isDraft: { type: Boolean, default: true, index: true, select: true },
    isPublished: { type: Boolean, default: false, index: true, select: false }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

// Document middleware to create product_slug before saving
productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

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

// create index for search
productSchema.index({ product_name: 'text', product_description: 'text' });