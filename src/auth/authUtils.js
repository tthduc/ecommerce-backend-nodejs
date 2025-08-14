'use strict';
const jwt = require('jsonwebtoken');

const createTokenPair = async(payload, publicKey, privateKey) => {
    try {
        const accessToken = await jwt.sign(payload, privateKey, { 
            algorithm: 'RS256',
            expiresIn: '15m' 
        });

        const refreshToken = await jwt.sign(payload, privateKey, { 
            algorithm: 'RS256',
            expiresIn: '7d' 
        });

        // verify the tokens
        jwt.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                // throw new Error('Invalid access token');
                console.error('Access token verification failed:', err.message);
            }

            console.log('Access token is valid:', decoded);
        });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error(error.message || 'Error creating token pair');
    }
};

module.exports = {
    createTokenPair
};