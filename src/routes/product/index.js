'use strict';

const express = require('express')
const router = express.Router()
const productController = require('./../../controllers/product.controller.js')
const { asyncHandler } = require('./../../auth/checkAuth.js')
const { authentication } = require('./../../auth/authUtils.js') 

// authentication
router.use(authentication)

// create product
router.post('/', asyncHandler(productController.createProduct));

module.exports = router