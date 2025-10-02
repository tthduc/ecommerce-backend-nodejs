'use strict'

const { product } = require('../../models/product.model')
const { getSelectData, getUnSelectData } = require('../../utils');
const { BadRequestError } = require('../../core/error.response');
const mongoose = require('mongoose');

const findAllDraftsForShop = async ({ product_shop, limit = 50, skip = 0 }) => {
    return await queryProduct({ product_shop, limit, skip });
}

const findAllPublishedForShop = async ({ product_shop, limit = 50, skip = 0 }) => {
    return await queryProduct({ product_shop, limit, skip });
}

const publishProductByShop = async ({ product_id, product_shop }) => {
    console.log('product_id', product_id);
    console.log('product_shop', product_shop);
    const foundProduct = await product.findOne({ _id: product_id, product_shop });
    if (!foundProduct) throw new BadRequestError('Product not found');

    if (foundProduct.isPublished) throw new BadRequestError('Product is already published')

    const { nModified } = await product.updateOne(
        { _id: product_id, product_shop },
        { isDraft: false, isPublished: true },
        { new: true }
    ).lean()

    return nModified;
}

const unPublishProductByShop = async ({ product_id, product_shop }) => {
    const foundProduct = await product.findOne({ _id: product_id, product_shop });
    if (!foundProduct) throw new BadRequestError('Product not found');

    if (!foundProduct.isPublished) throw new BadRequestError('Product is already unpublished')

    const { nModified } = await product.updateOne(
        { _id: product_id, product_shop },
        { isDraft: true, isPublished: false },
        { new: true }
    ).lean()

    return nModified;
}

const searchProducts = async ({ keySearch }) => {
    return await product.find({
        $text: { $search: new RegExp(keySearch, 'i') },
        isPublished: true,
    }, {
        score: { $meta: "textScore" }
    })
        .sort({ score: { $meta: "textScore" } })
        .populate('product_shop', 'name email -_id')
        .lean()
}

// find all products
const findAllProducts = async ({ limit = 50, sort = 'ctime', page = 1, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

    return await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData({ fields: select }))
        .lean();
}

// find product by id
const findProductById = async (product_id, unselect = []) => {
    return await product.findById(product_id)
        .select(getUnSelectData({ fields: unselect }))
        .populate('product_shop', 'name email -_id')
        .lean()
}

const updateProductById = async ({ product_id, payload, model }) => {
    if (!mongoose.Types.ObjectId.isValid(product_id)) {
        throw new Error('Invalid product_id');
    }

    return await model.findByIdAndUpdate(product_id, payload, { new: true });
}

// helper function
const queryProduct = async ({ product_shop, limit = 50, skip = 0 }) => {
    return await product.find({ product_shop, isDraft: true })
        .populate('product_shop', 'name email -_id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProducts,
    findAllProducts,
    findProductById,
    updateProductById
}