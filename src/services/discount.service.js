'use strict';

const Discount = require('../models/discount.model');
const { 
    findAllProducts 
} = require('../models/repositories/product.repo');
const { 
    BadRequestError,
    NotFoundError
 } = require('../core/error.response');
const { convertToObjectIdMongodb } = require('../utils');

class DiscountService {
    static async createDiscountCode(payload) {
        const { 
            code, 
            start_date, 
            end_date, 
            is_active,
            shop_id,
            min_order_value,
            product_ids,
            apply_to,
            name,
            description,
            value,
            max_value,
            max_uses,
            used_count,
            max_uses_per_user,
         } = payload;

        // Check if start_date is before end_date and start_date is not in the past
        if (new Date(start_date) >= new Date(end_date) || new Date() < new Date(start_date)) {
            throw new BadRequestError('Invalid date range for discount code');
        }

        // Check if discount code already exists
        const foundDiscount = await Discount.findOne(
            { discount_code: code, discount_shop_id: convertToObjectIdMongodb(shop_id) }
        ).lean();
        if (foundDiscount && foundDiscount.discount_isActive) {
            throw new BadRequestError('Discount code already exists');
        }

        const newDiscount = await Discount.create({
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_isActive: is_active,
            discount_shop_id: convertToObjectIdMongodb(shop_id),
            discount_min_order_value: min_order_value,
            discount_product_ids: product_ids,
            discount_apply_to: apply_to,
            discount_name: name,
            discount_description: description,
            discount_value: value,
            discount_max_value: max_value,
            discount_max_uses: max_uses,
            discount_used_count: used_count,
            discount_max_uses_per_user: max_uses_per_user,
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

    static async getAllDiscountCodes({ shopId, limit = 50, page = 1 }) {
        const discounts = await Discount.find({ discount_shop_id: convertToObjectIdMongodb(shopId) })
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();

        if (!discounts) {
            throw new NotFoundError('Get all discount codes failed');
        }

        const { discount_apply_to, discount_product_ids } = discounts;
        let products = [];

        if (discount_apply_to === 'all') {
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

        if (discount_apply_to === 'specific') {
            products = await findAllProducts({
                filter: { 
                    _id: { $in: discount_product_ids.map(id => convertToObjectIdMongodb(id)) },
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
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
                discount_shop_id: convertToObjectIdMongodb(shopId) ,
                discount_isActive: true,
            },
            unSelect: ['__v', 'discount_shop_id'],
            model: Discount
        });

        if (!discounts || discounts.length <= 0) {
            throw new NotFoundError('Get all discount codes failed');
        }

        return discounts;
    }
}