'use strict';

const express = require('express')
const router = express.Router()
const accessController = require('./../../controllers/access.controller.js')
const { asyncHandler } = require('./../../auth/checkAuth.js')
const { authenticationV2 } = require('./../../auth/authUtils.js') 

// login
router.post('/shop/login', asyncHandler(accessController.login));

// sign up
router.post('/shop/signup', asyncHandler(accessController.signUp));

// authentication
router.use(authenticationV2)

// refresh token
router.post('/shop/refresh-token', asyncHandler(accessController.handlerRefreshToken));

// logout
router.post('/shop/logout', asyncHandler(accessController.logout));

module.exports = router