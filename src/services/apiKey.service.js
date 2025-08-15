'use strict';

const findById = async (id) => {
    try {
        const apiKey = await ApiKeyModel.findById({ key: id, status: true }).lean();
        return apiKey;
    } catch (error) {
        throw new Error('Error finding API key');
    }
};

module.exports = {
    findById
};