'use strict';

const { NotFoundError } = require('../core/error.response');
const { findCartById } = require('../models/repositories/cart.repo');
const { checkProductByServer } = require('../models/repositories/product.repo');

class CheckoutService {
    /**
     * {
     *   cartId,
     *  userId,
     *  shop_order_ids: [
     *    {shopId, shop_discount:[], item_products: [{price, quantity, productId}]}
     *  ]
     * }
     * 
     */
    static async checkOutReview({
        cartId, userId, shop_order_ids
    }) {
        // check cartId
        const foundCart = await findCartById(cartId);
        if (!foundCart) {
            throw new NotFoundError('Cart not found');
        }

        const checkoutOrder = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }, shop_order_ids_new = [];

        // check shop_order_ids
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discount = [], item_products = [] } = shop_order_ids[i];
            
            const checkProductServer = await checkProductByServer(item_products);
            console.log('checkProductServer', checkProductServer);
            if (!checkProductServer[0]) {
                throw new NotFoundError('order wrong!!!');
            }

            // Total price
            const checkOutPrice = checkProductServer.reduce((acc, product) => acc + (product.price * product.quantity), 0);

            // Total price before discount
            checkoutOrder.totalPrice += checkOutPrice;

            const itemCheckout = {
                shopId,
                shop_discount,
                priceRaw: checkOutPrice, // Total price before discount
                priceApplyDiscount: checkOutPrice, // Total price after discount
                item_products: checkProductServer
            }

            if (shop_discount.length > 0) {
                const {totalPrice = 0, discount = 0} = getDiscountAmount({
                    codeId: shop_discount[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                });

                 // Total discount
                checkoutOrder.totalDiscount += discount;

                // if discount > 0 => apply discount
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkOutPrice - discount;
                }
            }

            // final price after discount
            checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
            shop_order_ids_new.push(itemCheckout);
        }

        return {
            checkoutOrder, 
            shop_order_ids,
            shop_order_ids_new
        };
    }
}

module.exports = CheckoutService;