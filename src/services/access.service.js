'use strict';

const shopModel = require('../models/shop.model');
const keyTokenService = require('../services/keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const roleShop = {
    SHOP: 'SHOP',
    WRITER: '00001',
    EDITOR: '00002',
    ADMIN: '00003'
}

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // check email exists
            // use lean to get plain JavaScript object better than not use lean
            const hodelShop = await shopModel.findOne({ email }).lean();
            if (hodelShop) {
                return {
                    code: '20002',
                    metadata: { message: 'Email already exists' }
                };
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
                })

                const publicKeyString = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey: publicKey
                });

                console.log("publicKeyString:", publicKeyString);
                if (!publicKeyString) {
                    return {
                        code: '20002',
                        metadata: { message: 'Error creating public key token' }
                    };
                }

                // create token pair
                const tokens = await createTokenPair(
                    {userId: newShop._id, email: newShop.email},
                    publicKeyString,
                    privateKey
                );
                console.log("TOKENS:", tokens);
                console.log("NEWSHOP:", newShop);

                if (!tokens) {
                    return {
                        code: '20002',
                        metadata: { message: 'Error creating token pair' }
                    };
                }
                
                return {
                    code: '20001',
                    metadata: {
                        shop: newShop,
                        tokens
                    }
                };
            }

        } catch (error) {
            return {
                code: '20002',
                metadata: { message: error.message }
            };
        }
    }
}

module.exports = AccessService;
