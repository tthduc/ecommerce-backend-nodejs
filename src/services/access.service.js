'use strict';

const shopModel = require('../models/shop.model');
const keyTokenService = require('../services/keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { ConflicRequestError, BadRequestError } = require('../core/error.response');

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

                // // create public key token
                const publicKeyString = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
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
                    code: '20001',
                    metadata: {
                        shop: getInfoData({fields: ['id', 'name', 'email'], object: newShop}),
                        tokens
                    }
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
