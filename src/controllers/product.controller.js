'use strict';
// const ProductService = require('../services/product.service');
const ProductServiceV2 = require('../services/product.service.xxx');
const { Ok, CREATED } = require('../core/success.response');

class ProductController{
    // createProduct = async (req, res, next) => {
    //     const { product_type } = req.body;
    //     return CREATED.send(res, {
    //         message: 'Product created successfully',
    //         metadata: await ProductService.createProduct(
    //             product_type, {
    //             ...req.body,
    //             product_shop: req.keyStore.userId
    //         })
    //     });
    // }

    createProduct = async (req, res, next) => {
        const { product_type } = req.body;
        return CREATED.send(res, {
            message: 'Product created successfully',
            metadata: await ProductServiceV2.createProduct(
                product_type, {
                ...req.body,
                product_shop: req.keyStore.userId
            })
        });
    }

    /**
     * @description: Get all draft products for shop
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     * @returns {Object} - List of draft products
     */
    findAllDraftsForShop = async (req, res, next) => {
        const { limit, skip } = req.query;
        const product_shop = req.keyStore.userId;

        return Ok.send(res, {
            message: 'Find all drafts for shop successfully',
            metadata: await ProductServiceV2.findAllDraftsForShop({ product_shop, limit, skip })
        });
    }

    findAllPublishedForShop = async (req, res, next) => {
        const { limit, skip } = req.query;
        const product_shop = req.keyStore.userId;

        return Ok.send(res, {
            message: 'Find all published for shop successfully',
            metadata: await ProductServiceV2.findAllPublishedForShop({ product_shop, limit, skip })
        });
    }

    publishProductByShop = async (req, res, next) => {
        const { product_id } = req.body;
        const product_shop = req.keyStore.userId;

        return Ok.send(res, {
            message: 'Publish product for shop successfully',
            metadata: await ProductServiceV2.publishProductByShop({ product_id, product_shop })
        });
    }

    unPublishProductByShop = async (req, res, next) => {
        const { product_id } = req.body;
        const product_shop = req.keyStore.userId;

        return Ok.send(res, {
            message: 'Unpublish product for shop successfully',
            metadata: await ProductServiceV2.unPublishProductByShop({ product_id, product_shop })
        });
    }

    searchProducts = async (req, res, next) => {
        return Ok.send(res, {
            message: 'Search products successfully',
            metadata: await ProductServiceV2.searchProducts(req.params)
        });
    }

    findAllProducts = async (req, res, next) => {
        const { limit, sort, page } = req.query;

        return Ok.send(res, {
            message: 'Find all products successfully',
            metadata: await ProductServiceV2.findAllProducts({ limit, sort, page })
        });
    }

    findProductById = async (req, res, next) => {
        return Ok.send(res, {
            message: 'Find product by id successfully',
            metadata: await ProductServiceV2.findProductById(req.params)
        });
    }

    updateProduct = async (req, res, next) => {
        const { product_type } = req.body;
        const product_shop = req.keyStore.userId;

        return Ok.send(res, {
            message: 'Update product successfully',
            metadata: await ProductServiceV2.updateProduct(product_type, req.params.product_id, {...req.body, product_shop})
        });
    }
}

module.exports = new ProductController();
