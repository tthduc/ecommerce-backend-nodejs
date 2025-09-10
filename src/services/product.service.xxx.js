'use strict'

const { product, clothing, electronics } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response');
const { 
    findAllDraftsForShop, 
    findAllPublishedForShop, 
    publishProductByShop, 
    unPublishProductByShop,
    searchProducts,
    findAllProducts,
    findProductById
} = require('../models/repositories/product.repo')

/**
    - Tách biệt logic khởi tạo → gom việc tạo object về một nơi (ProductFactory).
    - Nhất quán → tất cả sản phẩm đều kế thừa Product, mỗi loại override theo nhu cầu.
    - Dễ mở rộng (OCP) → thêm loại mới (Furniture…) chỉ cần tạo subclass + update Factory.
    - Giảm lỗi & dễ test → kiểm soát type, throw lỗi nếu không hợp lệ.
    - Phù hợp e-commerce/domain phức tạp → mỗi loại sản phẩm có attribute riêng, dễ quản lý.
    👉 Nói ngắn gọn: Factory Pattern giúp tạo object nhiều loại một cách chuẩn hóa, dễ mở rộng, dễ bảo trì, và tránh duplicate code.

    - Nhược điểm thêm type mới thì phải thêm vào productFactory
 */

// define Factory class to create product
class ProductFactory {
    static productRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static createProduct(type, data) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError('Invalid product type');

        return new productClass(data).createProduct();
    }

    static updateProduct({ product_id, payload }) {
        throw new Error('Method not implemented yet');
    }

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        return await findAllDraftsForShop({ product_shop, limit, skip });
    }

    static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
        return await findAllPublishedForShop({ product_shop, limit, skip });
    }

    static async publishProductByShop({ product_id, product_shop }) {
        return await publishProductByShop({ product_id, product_shop });
    }

    static async unPublishProductByShop({ product_id, product_shop }) {
        return await unPublishProductByShop({ product_id, product_shop });
    }

    static async searchProducts({ keySearch }) {
       return await searchProducts({ keySearch });
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({ limit, sort, page, filter, select: ['_id', 'product_name', 'product_thumb', 'product_price', 'product_quantity', 'product_type'] });
    }

    static async findProductById({ product_id, unselect = [] }) {
        return await findProductById({ product_id, unselect:['__v'] });
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

// define sub-class for different product types furniture
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('Create furniture failed')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('Create product failed')

        return newProduct
    }
}

ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;