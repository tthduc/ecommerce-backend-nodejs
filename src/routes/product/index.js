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

module.exports = router