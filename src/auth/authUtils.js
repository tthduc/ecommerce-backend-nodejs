'use strict';
const jwt = require('jsonwebtoken');
const asyncHandler = require('../helpers/asynchandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const keyTokenService = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'refreshtoken'
}

const createTokenPair = async(payload, publicKey, privateKey) => {
    try {
        const accessToken = await jwt.sign(payload, privateKey, { 
            algorithm: 'RS256',
            expiresIn: '30d' 
        });

        const refreshToken = await jwt.sign(payload, privateKey, { 
            algorithm: 'RS256',
            expiresIn: '60d' 
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

/**
 * Nó được bọc bởi asyncHandler, 
 * nghĩa là nếu trong quá trình check userId hoặc gọi DB có lỗi, 
 * thì lỗi sẽ được tự động đưa vào middleware xử lý lỗi.
 */
// const authentication = asyncHandler(async (req, res, next) => {
//     /**
//      * 1. Check userId missing
//      * 2. get accessToken
//      * 3. verify token
//      * 4. check userId in db
//      * 5. check keyStore with userId
//      * 6. return next
//      */
    
//     const userId = req.headers[HEADER.CLIENT_ID]?.toString();
//     if (!userId) {
//         throw new AuthFailureError('Missing userId in request headers');
//     }

//     const keyStore = await keyTokenService.findByUserId(userId);
//     if (!keyStore) {
//         throw new NotFoundError('Key store not found');
//     }

//     const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();
//     if (!accessToken) {
//         throw new AuthFailureError('Missing access token in request headers');
//     }
    
//     try {
//         const decoded = jwt.verify(accessToken, keyStore.publicKey);
//         if (userId != decoded.userId) {
//             throw new AuthFailureError('Invalid userId');
//         }

//         req.keyStore = decoded;
//     } catch (err) {
//         throw new AuthFailureError('Invalid access token');
//     }

//     next();
// });

const authenticationV2 = asyncHandler(async (req, res, next) => {
    /**
     * 1. Check userId missing
     * 2. get accessToken
     * 3. verify token
     * 4. check userId in db
     * 5. check keyStore with userId
     * 6. return next
     */
    
    const userId = req.headers[HEADER.CLIENT_ID]?.toString();
    if (!userId) {
        throw new AuthFailureError('Missing userId in request headers');
    }

    const keyStore = await keyTokenService.findByUserId(userId);
    if (!keyStore) {
        throw new NotFoundError('Key store not found');
    }

    if(req.headers[HEADER.REFRESH_TOKEN]) {
        const refreshToken = req.headers[HEADER.REFRESH_TOKEN].toString();
        try {
            const decoded = jwt.verify(refreshToken, keyStore.privateKey);
            if (userId != decoded.userId) {
                throw new AuthFailureError('Invalid userId');
            }

            req.keyStore = keyStore;
            req.user = decoded;
            req.refreshToken = refreshToken;

            return next();
        } catch (err) {
            throw new AuthFailureError('Invalid refresh token');
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();
    if (!accessToken) {
        throw new AuthFailureError('Missing access token in request headers');
    }
    
    try {
        const decoded = jwt.verify(accessToken, keyStore.publicKey);
        if (userId != decoded.userId) {
            throw new AuthFailureError('Invalid userId');
        }

        req.keyStore = decoded;
    } catch (err) {
        throw new AuthFailureError('Invalid access token');
    }

    next();
});

const verifyJWT = async (token, publicKey) => {
    return await jwt.verify(token, publicKey);
};

module.exports = {
    createTokenPair,
    // authentication,
    verifyJWT,
    authenticationV2
};