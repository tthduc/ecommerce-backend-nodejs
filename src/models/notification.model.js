'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

// ORDER-001: order successfully
// ORDER-002: order failed
// SHOP-001: new product by user followed shop

const NotificationSchema = new Schema({
    notification_type: {
        type: String,
        enum: ['ORDER-001', 'ORDER-002', 'SHOP-001'],
        required: true,
    },
    notification_senderId: {
        type: Number,
        required: true,
    },
    notification_receiverId: {
        type: Number,
        required: true,
    },
    notification_content: {
        type: String,
        required: true,
    },
    notification_options: {
        type: Object,
        default: {},
    },
    // notification_isRead: {
    //     type: Boolean,
    //     default: false,
    // }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, NotificationSchema);