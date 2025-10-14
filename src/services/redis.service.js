'use strict';

const redis = require('redis');
const { promisify } = require('util');
const { reservationInventory } = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient();

const pexpireAsync = promisify(redisClient.pexpire).bind(redisClient);
const setNxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v202507_${productId}`;
    const retryTimes = 5;
    const expireTime = 3000; // 3 seconds

    for (let i = 0; i < retryTimes; i++) {
        // Create a unique key for the lock
        const lockAcquired = await setNxAsync(key, expireTime);
        console.log('lockAcquired', lockAcquired);

        if (lockAcquired === 1) {
            const isReservation = await reservationInventory({ productId, quantity, cartId });
            if (isReservation.modifiedCount > 0) {
                await pexpireAsync(key, expireTime);
                return key;
            }

            return null;
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // wait 100ms before retrying
    }
    return false;
};

const releaseLock = (key) => {
    const deleteAsync = promisify(redisClient.del).bind(redisClient);
    return deleteAsync(key);
};

module.exports = {
    acquireLock,
    releaseLock
};