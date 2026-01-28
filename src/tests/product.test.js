const redisPubSubService = require('../services/redisPubSubService');

class ProductServiceTest {
    static purchaseProduct(productId, quantity) {
        const order = {
            productId,
            quantity
        }

        redisPubSubService.publish('product:purchase', JSON.stringify(order));
    }
}

module.exports = ProductServiceTest;