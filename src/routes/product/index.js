'use strict';

const express = require('express')
const router = express.Router()
const productController = require('./../../controllers/product.controller.js')
const { asyncHandler } = require('./../../auth/checkAuth.js')
const { authenticationV2 } = require('./../../auth/authUtils.js') 

// authentication
router.use(authenticationV2)

// create product
router.post('/', asyncHandler(productController.createProduct));

// get all draft products for shop
router.get('/drafts', asyncHandler(productController.findAllDraftsForShop));

// get all published products for shop
router.get('/published', asyncHandler(productController.findAllPublishedForShop));

// publish product
router.post('/publish', asyncHandler(productController.publishProductByShop));

// unpublish product
router.post('/unpublish', asyncHandler(productController.unPublishProductByShop));

module.exports = router