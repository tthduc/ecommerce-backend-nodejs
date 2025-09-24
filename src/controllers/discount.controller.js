'use strict';
const DiscountService = require('../services/discount.service');
const { Ok, CREATED } = require('../core/success.response');

class DiscountController {
    createDiscountCode = async (req, res, next) => {
        return CREATED.send(res, {
            message: 'Discount code created successfully',
            metadata: await DiscountService.createDiscountCode({
                ...req.body, shop_id: req.keyStore.userId
            })
        });
    }

    getAllDiscountCodes = async (req, res, next) => {
        return Ok.send(res, {
            message: 'Get all discount codes successfully',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shop_id: req.keyStore.userId,
            })
        });
    }

    getDiscountAmount = async (req, res, next) => {
        return Ok.send(res, {
            message: 'Get discount amount successfully',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        });
    }

    getAllDiscountCodesWithProducts = async (req, res, next) => {
        return Ok.send(res, {
            message: 'Get all discount codes with products successfully',
            metadata: await DiscountService.getAllDiscountCodesWithProducts({
                ...req.query
            })
        });
    }
}

module.exports = new DiscountController();