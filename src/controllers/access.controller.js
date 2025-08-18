'use strict';
const AccessService = require('../services/access.service');
const { OK, CREATED } = require('../core/success.response');

class AccessController{
    signUp = async (req, res, next) => {
        return CREATED.send(res, {
            message: 'User created successfully',
            metadata: await AccessService.signUp(req.body)
        });
    }
}

module.exports = new AccessController();
