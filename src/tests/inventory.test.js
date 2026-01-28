const redisPubSubService = require('../services/redisPubSubService');

class InventoryServiceTest {
    constructor() {
        this.inventoryUpdates = [];
        redisPubSubService.subscribe('product:purchase', (channel, message) => {
            this.InventoryServiceTest.updateInventory(message);
        });
    }

    static updateInventory(productId, quantity) {
        console.log(`Updating inventory for product ${productId} with quantity ${quantity}`);
    }
}

module.exports = InventoryServiceTest;