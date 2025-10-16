'use strict';

const express = require('express')
const router = express.Router()

const inventoryController = require('./../../controllers/inventory.controller.js')
const { asyncHandler } = require('./../../auth/checkAuth.js')
const { authenticationV2 } = require('./../../auth/authUtils.js') 

// authentication
router.use(authenticationV2)

// add stock to inventory
router.post('', asyncHandler(inventoryController.addStockToInventory));

module.exports = router