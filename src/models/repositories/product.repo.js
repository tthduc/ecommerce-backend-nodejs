'use strict'

const { product, clothing, electronics } = require('../../models/product.model')

const findAllDraftsForShop = async ({ product_shop, limit = 50, skip = 0 }) => {
    return await queryProduct({ product_shop, limit, skip });
}

const findAllPublishedForShop = async ({ product_shop, limit = 50, skip = 0 }) => {
    return await queryProduct({ product_shop, limit, skip });
}

const publishProductByShop = async ({ product_id, product_shop }) => {
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
    unPublishProductByShop
}