'use strict';

const cart = require('../models/cart.model');

class CartService {
    static async createCart({userId, product}) {
        const query = { cart_userId: userId, cart_status: 'active' };
        const updateOrInsert = {
            $addToSet: { 
                cart_products: products 
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

    static async removeFromCart(userId, productId) {
        // Logic to remove product from cart
        return { userId, productId };
    }

    static async getCart(userId) {
        // Logic to get user's cart
        return { userId, items: [] };
    }
}

module.exports = CartService;