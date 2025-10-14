'use strict'

const inventory = require('../inventory.model');
const { convertToObjectId } = require('../../utils');

const insertInventory = async (data) => {
    return await inventory.create(data);
}

const reservationInventory = async ({productId, quantity, cartId}) => {
    const query = {
        inven_productId: convertToObjectId(productId),
        inven_stock: { $gte: quantity }
    }, updateSet = {
        $inc: { inven_stock: -quantity },
        $push: { inven_reservations: { cartId, quantity, createdAt: new Date() } }
    }, options = { upsert: true, new: true };

    return await inventory.findOneAndUpdate(query, updateSet, options).lean();
}

module.exports = {
    insertInventory,
    reservationInventory
}