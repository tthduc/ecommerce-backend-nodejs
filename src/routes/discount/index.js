'use strict';

const express = require('express')
const router = express.Router()

const discountController = require('./../../controllers/discount.controller.js')
const { asyncHandler } = require('./../../auth/checkAuth.js')
const { authenticationV2 } = require('./../../auth/authUtils.js') 

// get discount amount
router.post('/amount', asyncHandler(discountController.getDiscountAmount));

// get all discount codes
router.get('/list-product-code', asyncHandler(discountController.getAllDiscountCodesWithProducts));

// authentication
router.use(authenticationV2)

// create discount code
router.post('/', asyncHandler(discountController.createDiscountCode))

// get all discount codes by shop
router.get('/', asyncHandler(discountController.getAllDiscountCodes));

module.exports = router