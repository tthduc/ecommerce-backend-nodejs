'use strict';

const express = require('express')
const router = express.Router()

const commentController = require('./../../controllers/comment.controller.js')
const { asyncHandler } = require('./../../auth/checkAuth.js')

// create a new comment
router.post('/', asyncHandler(commentController.createComment));

// get comments by product ID
router.get('/product/:productId', asyncHandler(commentController.getCommentsByProductId));

module.exports = router