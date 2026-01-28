'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';

const CommentSchema = new Schema({
    comment_productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    comment_userId: {
        type: Number,
        default: 1,
    },
    comment_content: {
        type: String,
        required: true,
    },
    comment_left: {
        type: Number,
        default: 0,
    },
    comment_right: {
        type: Number,
        default: 0,
    },
    comment_parentId: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: DOCUMENT_NAME  
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = model(DOCUMENT_NAME, CommentSchema);