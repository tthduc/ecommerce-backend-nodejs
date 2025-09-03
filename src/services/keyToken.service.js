'use strict';

const keyTokenModel = require('../models/keyToken.model');
const { Types } = require('mongoose')

class KeyTokenService {
    static createKeyToken = async({userId, publicKey, privateKey, refreshToken}) => {
        try {
            // level 0
            // const publicKeyString = publicKey.toString();
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey: publicKeyString
            // });

            // return tokens ? publicKeyString : null;

            // level xxx
            const filter = { user: userId };
            const update = { publicKey: publicKey.toString(), privateKey: privateKey.toString(), refreshToken, refreshTokensUsed: [] };
            const options = { new: true, upsert: true };
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            throw new Error('Error creating key token');
        }
    }

    static findByUserId = async (userId) => {
        const tokens = await keyTokenModel.findOne({ user: new Types.ObjectId(userId) });
        return tokens || null;
    }

    static deleteKeyToken = async (id) => {
        const result = await keyTokenModel.deleteOne({ user: new Types.ObjectId(id) });
        console.log('Key token deleted:', result);
        return result.deletedCount > 0;
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        const tokens = await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
        return tokens || null;
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken });
    }
}

module.exports = KeyTokenService;
