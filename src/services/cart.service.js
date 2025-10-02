'use strict';

const cart = require('../models/cart.model');
const { findProductById } = require('../models/repositories/product.repo');
const { NotFoundError } = require('../core/error.response');

class CartService {
    static async createCart({userId, product}) {
        const query = { cart_userId: userId, cart_status: 'active' };
        const updateOrInsert = {
            $addToSet: { 
                cart_products: product 
            }
        };
        const options = { upsert: true, new: true };

        return await cart.findOneAndUpdate(query, updateOrInsert, options);
    }

    static async updateCartQuantity({userId, product}) {
        const { productId, quantity } = product;
        const query = { 
            cart_userId: userId, 
            'cart_products.productId': productId,
            cart_status: 'active'
        }
        const updateSet = {
            $inc: {
                // Increment quantity if greater than 0, else remove product
                'cart_products.$.quantity': quantity
            }
        };
        const options = { new: true };

        return await cart.findOneAndUpdate(query, updateSet, options);
    }

    static async addToCart({userId, product = {}}) {
        const userCart = await cart.findOne({cart_userId: userId});
        if(!userCart) {
            // Create new cart for user
            return await this.createCart({userId, product});
        }

        // If cart exists, but product not in cart, add new product
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product];
            return await userCart.save();
        }

        // If cart and product exists, increase quantity
        return await this.updateCartQuantity({userId, product});
    }

    static async addToCartV2({userId, shop_order_ids}) {
        console.log('shop_order_ids', shop_order_ids);
        const { productId, quantity, oldQuantity } = shop_order_ids[0]?.item_products[0] || {};
        
        // Validate product exists
        const foundProduct = await findProductById(productId);
        if (!foundProduct) throw new NotFoundError('Product not found');

        // console.log('foundProduct', foundProduct, shop_order_ids[0]?.shopId);
        // // Validate product belongs to the specified shop
        // if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
        //     throw new NotFoundError('Product does not belong to the specified shop');
        // }

        if (quantity <= 0) {
            throw new NotFoundError('Quantity must be greater than zero');
        }

        return await this.updateCartQuantity({
            userId, 
            product: {
                productId, 
                quantity: quantity - (oldQuantity || 0)
            }
        });
    }

    static async removeFromCart({userId, productId}) {
        const query = { cart_userId: userId, cart_status: 'active' };
        const updateSet = {
            $pull: { 
                cart_products: { productId } 
            }
        };
        const options = { new: true };

        return await cart.findOneAndUpdate(query, updateSet, options);
    }

    static async getListCart({userId}) {
        return await cart.findOne({ cart_userId: userId, cart_status: 'active' }).lean();
    }
}

module.exports = CartService;