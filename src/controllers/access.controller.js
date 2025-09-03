'use strict';
const AccessService = require('../services/access.service');
const { Ok, CREATED } = require('../core/success.response');

class AccessController{
    login = async (req, res, next) => {
        return Ok.send(res, {
            message: 'Login successful',
            metadata: await AccessService.login(req.body)
        });
    }

    signUp = async (req, res, next) => {
        return CREATED.send(res, {
            message: 'User created successfully',
            metadata: await AccessService.signUp(req.body)
        });
    }

    logout = async (req, res, next) => {
        return Ok.send(res, {
            message: 'Logout successful',
            metadata: await AccessService.logout(req.keyStore)
        });
    }

    handlerRefreshToken = async (req, res, next) => {
        return Ok.send(res, {
            message: 'Refresh token successful',
            // metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
            metadata: await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        });
    }
}

module.exports = new AccessController();
