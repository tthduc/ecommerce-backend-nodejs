'use strict';

const { NotFoundError, ForbiddenError } = require('../core/error.response');
const { getProductById } = require('../models/repositories/product.repo');
const Inventory = require('../models/inventory.model');

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = 'xxxx'
    }) {
        const product = await getProductById(productId);
        if (!product) {
            throw new NotFoundError('Product not found');
        }

        // Only owner of product can add stock
        if (product.product_shop.toString() !== shopId) {
            throw new ForbiddenError('You do not have permission to add stock to this product');
        }

        const query = { inventory_productId: productId, inventory_shopId: shopId };
        const updateSet = {
            $inc: { inventory_stock: stock },
            $set: { inventory_location: location }
        };
        const options = { upsert: true, new: true };

        const newInventory = await Inventory.findOneAndUpdate(
            query,
            updateSet,
            options
        );  

        return newInventory;
    }
}

module.exports = InventoryService;