'use strict'

const inventory = require('../inventory.model');

const insertInventory = async (data) => {
    return await inventory.create(data);
}

module.exports = {
    insertInventory
}