'use strict';
const ProductService = require('../services/product.service');
const { Ok, CREATED } = require('../core/success.response');

class ProductController{
    createProduct = async (req, res, next) => {
        const { product_type } = req.body;
        return CREATED.send(res, {
            message: 'Product created successfully',
            metadata: await ProductService.createProduct(
                product_type, {
                ...req.body,
                product_shop: req.keyStore.userId
            })
        });
    }
}

module.exports = new ProductController();
