'use strict';

const findById = async (id) => {
    const apiKey = await ApiKeyModel.findById({ key: id, status: true }).lean();
    return apiKey;
};

module.exports = {
    findById
};