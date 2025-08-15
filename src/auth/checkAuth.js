'use strict';

const { findById } = require('../services/apiKey.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'Authorization'
}

const apiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers[HEADER.API_KEY]?.toString();
        if (!apiKey) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Validate API key
        const objKey = await findById(apiKey);
        if (!objKey) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.objKey = objKey;

        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const permission = async (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({ message: 'permissions denied' });
        }

        const hasPermission = req.objKey.permissions.includes(permission);
        if (!hasPermission) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    };
};

module.exports = {
    apiKey,
    permission
};