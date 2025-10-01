'use strict';

const CartService = require('../services/cart.service');
const { Ok, CREATED } = require('../core/success.response');

class CartController {
    // [POST] /cart
    addToCart = async (req, res, next) => {
        return CREATED.send(res, {
            message: 'Item added to cart successfully',
            metadata: await CartService.addToCart(req.body)
        });
    }

    update = async (req, res, next) => {
        return Ok.send(res, {
            message: 'Cart updated successfully',
            metadata: await CartService.addToCartV2(req.body)
        });
    }

    remove = async (req, res, next) => {
        return Ok.send(res, {
            message: 'removed cart successfully',
            metadata: await CartService.remove(req.body)
        });
    }

    listToCart = async (req, res, next) => {
        return Ok.send(res, {
            message: 'Get list cart successfully',
            metadata: await CartService.getListCart(req.body)
        });
    }
}

module.exports = new CartController();