'use strict';

const shopModel = require('../models/shop.model');
const keyTokenService = require('../services/keyToken.service');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { ConflicRequestError, BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');

// service
const { findByEmail } = require('./shop.service');

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const roleShop = {
    SHOP: 'SHOP',
    WRITER: '00001',
    EDITOR: '00002',
    ADMIN: '00003'
}

class AccessService {
    /**
     * 1. check refresh token is exists
     * 2. verify refresh token
     * 3. create new access token
     * 4. return new access token
     */
    // static handlerRefreshToken = async(refreshToken) => {
    //     const foundToken = await keyTokenService.findByRefreshTokenUsed(refreshToken);
    //     if (foundToken) {
    //         // decode refresh token
    //         const { userId, email } = await verifyJWT(refreshToken, foundToken.publicKey);
    //         console.log('Decoded refresh token:', { userId, email });

    //         // delete refresh token
    //         await keyTokenService.deleteKeyToken(userId);

    //         throw new ForbiddenError('Refresh token is reused. Please login again');
    //     }

    //     const tokens = await keyTokenService.findByRefreshToken(refreshToken);
    //     if (!tokens) {
    //         throw new AuthFailureError('Refresh token is not registered');
    //     }

    //     // verify token
    //     const { email } = await verifyJWT(refreshToken, tokens.publicKey);

    //     // check userid
    //     const foundShop = await findByEmail({ email });
    //     if (!foundShop) {
    //         throw new AuthFailureError('Shop not found');
    //     }

    //     const newTokens = await createTokenPair(
    //         { userId: tokens.userId, email: tokens.email },
    //         tokens.publicKey,
    //         tokens.privateKey
    //     );

    //     await tokens.updateOne({
    //         $set: {
    //             refreshToken: newTokens.refreshToken,
    //             accessToken: newTokens.accessToken
    //         },
    //         $addToSet: {
    //             refreshTokensUsed: refreshToken
    //         }
    //     })

    //     return newTokens
    // }

    static handlerRefreshTokenV2 = async({refreshToken, user, keyStore}) => {
        console.log({refreshToken, user, keyStore});
        const {userId, email} = user;

        // Check if refresh token is reused
        if(keyStore.refreshTokensUsed.includes(refreshToken)) {
            await keyTokenService.deleteKeyToken(userId);
            throw new ForbiddenError('Refresh token is reused. Please login again');
        }

        // Check if refresh token is valid
        if(keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError('Refresh token does not match');
        }

        // Check if shop exists
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new AuthFailureError('Shop not found');
        }

        const newTokens = await createTokenPair(
            { userId: userId, email: email },
            keyStore.publicKey,
            keyStore.privateKey
        );

        await keyStore.updateOne({
            $set: {
                refreshToken: newTokens.refreshToken,
                accessToken: newTokens.accessToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        });

        return newTokens
    }

    static logout = async (keyStore) => {
        const delKey = await keyTokenService.deleteKeyToken(keyStore.userId);
        return delKey
    }

    /***
     * 1. check shop is exists or not
     * 2. check email and password
     * 3. create access token, refresh token and save
     * 4. return user info and tokens
     */
    static login = async({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email });
        if (!foundShop) {
            throw new BadRequestError('Shop not found');
        }

        const isMatch = await bcrypt.compare(password, foundShop.password);
        if (!isMatch) {
            throw new AuthFailureError('Authentication failed');
        }

         // create private and publickey key for shop
        const {privateKey, publicKey} = await crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        })

        // create token pair
        const {_id: userId} = foundShop;
        const tokens = await createTokenPair(
            {userId, email},
            publicKey,
            privateKey
        );

        // create public key token
        await keyTokenService.createKeyToken({
            userId,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        if (!tokens) {
            throw new BadRequestError('Error creating token pair');
        }

        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        };
    }

    static signUp = async ({ name, email, password }) => {
        // try {
            // check email exists
            // use lean to get plain JavaScript object better than not use lean
            const hodelShop = await shopModel.findOne({ email }).lean();
            if (hodelShop) {
                throw new ConflicRequestError('Email already exists');
            }

            // hash password use 10 to salt rounds
            const passwordHashed = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({
                name,
                email,
                password: passwordHashed,
                roles: [roleShop.SHOP]
            })
            if (newShop) {
                // create private and publickey key for shop
                const {privateKey, publicKey} = await crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem'
                    }
                })

                // create private and publickey key for shop V2
                // const privateKey = crypto.getRandomValues(64).toString('hex');
                // const publicKey = crypto.getRandomValues(64).toString('hex');

                // create public key token
                const publicKeyString = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                    refreshToken: null
                });

                if (!publicKeyString) {
                    throw new BadRequestError('Error creating public key token');
                }

                // create public key object
                const publicKeyObject = crypto.createPublicKey(publicKeyString);

                // create token pair
                const tokens = await createTokenPair(
                    {userId: newShop._id, email: newShop.email},
                    publicKeyObject,
                    privateKey
                );

                if (!tokens) {
                    throw new BadRequestError('Error creating token pair');
                }
                
                return {
                    shop: getInfoData({fields: ['id', 'name', 'email'], object: newShop}),
                    tokens
                };
            }

        // } catch (error) {
        //     return {
        //         code: '20002',
        //         metadata: { message: error.message }
        //     };
        // }
    }
}

module.exports = AccessService;
