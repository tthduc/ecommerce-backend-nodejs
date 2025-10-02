'use strict';

const express = require('express')
const router = express.Router()

const cartController = require('./../../controllers/cart.controller.js')
const { asyncHandler } = require('./../../auth/checkAuth.js')
const { authenticationV2 } = require('./../../auth/authUtils.js') 

// authentication
router.use(authenticationV2)

// add to cart
router.post('/', asyncHandler(cartController.addToCart));

// update cart
router.post('/update', asyncHandler(cartController.update));

// remove cart
router.delete('/', asyncHandler(cartController.remove));

// get list cart
router.get('/', asyncHandler(cartController.listToCart));

module.exports = router