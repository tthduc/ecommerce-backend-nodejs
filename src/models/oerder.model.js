'use strict';

const mongoose = require('mongoose');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'orders';

const orderSchema = mongoose.Schema(
    {
        order_userId: {
            type: Number,
            required: true,
        },
        /** Checkout information 
         * {
         *  totalPrice,
         *  totalApplyDiscount,
         *  feeShip
         * }
        */
        order_checkout: {
            type: Object,
            default: {},
        },

        /**
         * Shipping information
         * {
         *  street,
         *  city,
         *  state,
         *  country,
         * }
         */
        order_shipping: {
            type: Object,
            default: {},
        },
        order_payment: {
            type: Object,
            default: {},
        },
        order_products: {
            type: Array,
            required: true,
        },
        order_trackingNumber: {
            type: String,   
            default: '#000000',
        },
        order_status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'canceled'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);