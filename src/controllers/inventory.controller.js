'use strict';

const InventoryService = require('../services/inventory.service');
const { Ok, CREATED } = require('../core/success.response');

class InventoryController {
     async addStockToInventory(req, res, next) {
        return CREATED.send(res, {
            message: 'Stock added to inventory successfully',
            metadata: await InventoryService.addStockToInventory({
                ...req.body, shop_id: req.keyStore.userId
            })
        });
    }
}

module.exports = new InventoryController();