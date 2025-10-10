'use strict';

const CheckoutService = require('../services/checkout.service');
const { Ok, CREATED } = require('../core/success.response');

class CheckoutController {
    checkoutReview = async (req, res, next) => {
        return CREATED.send(res, {
            message: 'Item added to cart successfully',
            metadata: await CheckoutService.checkOutReview(req.body)
        });
    }
}