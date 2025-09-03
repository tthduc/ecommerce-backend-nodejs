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
            metadata: await ProductServiceV2.ProductServiceV2(
                product_type, {
                ...req.body,
                product_shop: req.keyStore.userId
            })
        });
    }
}

module.exports = new ProductController();
