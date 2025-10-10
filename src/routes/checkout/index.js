'use strict';

const express = require('express')
const router = express.Router()

const checkoutController = require('./../../controllers/checkout.controller.js')
const { asyncHandler } = require('./../../auth/checkAuth.js')
const { authenticationV2 } = require('./../../auth/authUtils.js')

// authentication
router.use(authenticationV2)

// checkout review
router.post('/review', asyncHandler(checkoutController.checkoutReview));

module.exports = router