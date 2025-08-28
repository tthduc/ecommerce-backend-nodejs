'use strict'

const { product, clothing, electronics } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response');

/**
    - Tách biệt logic khởi tạo → gom việc tạo object về một nơi (ProductFactory).
    - Nhất quán → tất cả sản phẩm đều kế thừa Product, mỗi loại override theo nhu cầu.
    - Dễ mở rộng (OCP) → thêm loại mới (Furniture…) chỉ cần tạo subclass + update Factory.
    - Giảm lỗi & dễ test → kiểm soát type, throw lỗi nếu không hợp lệ.
    - Phù hợp e-commerce/domain phức tạp → mỗi loại sản phẩm có attribute riêng, dễ quản lý.
    👉 Nói ngắn gọn: Factory Pattern giúp tạo object nhiều loại một cách chuẩn hóa, dễ mở rộng, dễ bảo trì, và tránh duplicate code.
 */

// define Factory class to create product
class ProductFactory {
    static createProduct(type, data) {
        switch (type) {
        case 'Clothing':
            return new Clothing(data).createProduct();
        case 'Electronics':
            return new Electronics(data).createProduct();
        default:
            throw new BadRequestError('Invalid product type');
        }
    }
}

class Product {
    constructor(data) {
        this.product_name = data.product_name;
        this.product_thumb = data.product_thumb;
        this.product_description = data.product_description;
        this.product_price = data.product_price;
        this.product_quantity = data.product_quantity;
        this.product_type = data.product_type;
        this.product_attributes = data.product_attributes;
        this.product_shop = data.product_shop;
    }

    async createProduct(product_id) {
        return await product.create({...this, _id: product_id})
    }
}

// define sub-class for different product types clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError('Create clothing failed')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Create product failed')

        return newProduct
    }
}

// define sub-class for different product types electronics
class Electronics extends Product {
    async createProduct() {
        const newElectronics = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronics) throw new BadRequestError('Create electronics failed')

        const newProduct = await super.createProduct(newElectronics._id)
        if (!newProduct) throw new BadRequestError('Create product failed')

        return newProduct
    }
}

module.exports = ProductFactory;