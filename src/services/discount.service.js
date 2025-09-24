'use strict';

const Discount = require('../models/discount.model');
const { 
    findAllProducts 
} = require('../models/repositories/product.repo');
const { 
    checkDiscountCodeExist,
    findAllDiscountCodesUnselect
} = require('../models/repositories/discount.repo');
const { 
    BadRequestError,
    NotFoundError
 } = require('../core/error.response');
const { convertToObjectIdMongodb } = require('../utils');

class DiscountService {
    static async createDiscountCode(payload) {
        const { 
            code, 
            discount_startDate, 
            discount_endDate, 
            is_active,
            shop_id,
            min_order_value,
            discount_productIds,
            discount_applied_products,
            name,
            description,
            value,
            max_value,
            discount_max_usage,
            used_count,
            max_uses_per_user,
         } = payload;

        if (new Date(discount_startDate) >= new Date(discount_endDate)) {
            throw new BadRequestError('Invalid discount code: start date must be before end date');
        }

        // Check if discount code already exists
        const foundDiscount = await Discount.findOne(
            { discount_code: code, discount_shopId: convertToObjectIdMongodb(shop_id) }
        ).lean();
        if (foundDiscount && foundDiscount.discount_isActive) {
            throw new BadRequestError('Discount code already exists');
        }

        const newDiscount = await Discount.create({
            discount_code: code,
            discount_startDate,
            discount_endDate,
            discount_isActive: is_active,
            discount_shop_id: convertToObjectIdMongodb(shop_id),
            discount_min_order_value: min_order_value,
            discount_productIds,
            discount_applied_products,
            discount_name: name,
            discount_description: description,
            discount_value: value,
            discount_max_value: max_value,
            discount_max_usage,
            discount_used_count: used_count,
            discount_max_uses_per_user: max_uses_per_user,
            discount_shopId: convertToObjectIdMongodb(shop_id)
        });

        if (!newDiscount) {
            throw new BadRequestError('Create new discount code failed');
        }

        return newDiscount;
    }

    static async updateDiscountCode(discountId, payload) {
        const updatedDiscount = await Discount.findByIdAndUpdate(
            convertToObjectIdMongodb(discountId),
            { $set: payload },
            { new: true }
        );

        if (!updatedDiscount) {
            throw new BadRequestError('Update discount code failed');
        }

        return updatedDiscount;
    }

    static async getAllDiscountCodesWithProducts({ code, shopId, limit = 50, page = 1 }) {
        console.log('code, shopId, limit, page: ', code, shopId, limit, page);
        const discounts = await Discount.findOne({ 
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId) 
        })
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();

        if (!discounts) {
            throw new NotFoundError('Get all discount codes failed');
        }

        const { discount_applied_products, discount_productIds } = discounts;
        let products = [];

        if (discount_applied_products === 'all') {
            products = await findAllProducts({
                filter: { 
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            });
        }

        if (discount_applied_products === 'specific') {
            products = await findAllProducts({
                filter: { 
                    _id: { $in: discount_productIds.map(id => convertToObjectIdMongodb(id)) },
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true
                },
                limit: +limit, // convert to number
                page: +page, // convert to number
                sort: 'ctime',
                select: ['product_name']
            });
        }

        return products;
    }

    static async getAllDiscountCodesByShop({limit = 50, page = 1, shopId}) {
        const discounts = await findAllDiscountCodesUnselect({
            limit: +limit,
            page: +page,
            sort: 'ctime',
            filter: { 
                discount_shopId: convertToObjectIdMongodb(shopId) ,
                discount_isActive: true,
            },
            unSelect: ['__v', 'discount_shopId'],
            model: Discount
        });

        if (!discounts || discounts.length <= 0) {
            throw new NotFoundError('Get all discount codes failed');
        }

        return discounts;
    }

    // Calculate discount amount for a given order
    static async getDiscountAmount({ code, userId, shopId, products }) {
        console.log('code, userId, shopId, products: ', code, userId, shopId, products);
        const foundDiscount = await checkDiscountCodeExist(
            Discount,
            { 
                discount_code: code, 
                discount_shopId: convertToObjectIdMongodb(shopId),
                // discount_isActive: true,
                // discount_start_date: { $lte: new Date() },
                // discount_end_date: { $gte: new Date() },
            }
        );

        if (!foundDiscount) {
            throw new NotFoundError('Discount code not found or inactive');
        }

        if (foundDiscount.discount_isActive === false) {
            throw new BadRequestError('Discount code is expired or inactive');
        }

        if (foundDiscount.discount_max_usage == 0) {
            throw new BadRequestError('Discount code has reached its maximum usage limit');
        }

        if (new Date() < new Date(foundDiscount.discount_startDate) || new Date() > new Date(foundDiscount.discount_endDate)) {
            throw new BadRequestError('Discount code is not valid at this time');
        }

        // Check if user has exceeded max uses per user
        if (foundDiscount.discount_max_uses_per_user > 0) {
            const userUsageCount = foundDiscount.discount_used_by.filter(id => id.toString() === userId).length;
            if (userUsageCount >= foundDiscount.discount_max_uses_per_user) {
                throw new BadRequestError('You have exceeded the maximum usage limit for this discount code');
            }
        }

        // Check if total order value meets min order value
        const totalOrderValue = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
        if (totalOrderValue < foundDiscount.discount_min_order_value) {
            throw new BadRequestError(`Order value must be at least ${foundDiscount.discount_min_order_value} to use this discount code`);
        }

        // Calculate discount amount
        const amount = foundDiscount.discount_type === 'fixed' ? foundDiscount.discount_value
            : (totalOrderValue * foundDiscount.discount_value) / 100;

        return {
            totalOrderValue,
            discount: amount,
            finalAmount: totalOrderValue - amount
        };
    }

    static async deleteDiscountCode({shopId, discountId}) {
        const deletedDiscount = await Discount.findByIdAndDelete({
            discount_shop_id: convertToObjectIdMongodb(shopId),
            discount_code: convertToObjectIdMongodb(discountId)
        });

        if (!deletedDiscount) {
            throw new NotFoundError('Delete discount code failed');
        }

        return deletedDiscount;
    }

    static async cancelDiscountCode({shopId, discountId}) {
        const foundDiscount = await checkDiscountCodeExist(
            Discount,
            { 
                discount_code: discountId, 
                discount_shop_id: convertToObjectIdMongodb(shopId),
            }
        );

        if (!foundDiscount) {
            throw new NotFoundError('Discount code not found or inactive');
        }

        if (foundDiscount.discount_isActive === false) {
            throw new BadRequestError('Discount code is already cancelled');
        }

        // Set discount_isActive to false
        const cancelledDiscount = await Discount.findByIdAndUpdate(
            {
                $pull: { discount_used_by: userId },
                $inc: { discount_used_count: -1, discount_max_usage: 1 }
            },
            { new: true }
        );

        if (!cancelledDiscount) {
            throw new NotFoundError('Cancel discount code failed');
        }

        return cancelledDiscount;
    }
}

module.exports = DiscountService;