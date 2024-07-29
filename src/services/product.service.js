const { BadRequestError } = require('../core/error.response');
const { product, clothing, electronic } = require('../models/product.model');

class ProductFactory{
    createProduct(type, productData){
        switch(type){
            case 'clothing':
                return new Clothing(productData).createProduct();
            case 'electronic':
                return new Electronic(productData).createProduct();
            default:
                throw new BadRequestError('Invalid product type');
        }
    }
}

class Product {
    constructor({product_name, product_price, product_description, product_thumbnail, product_quantity, product_type, product_shop, product_attribute}) {
        this.product_name = product_name;
        this.product_price = product_price;
        this.product_description = product_description;
        this.product_thumbnail = product_thumbnail;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attribute = product_attribute;
    }

    async createProduct() {
        return await product.create(this);
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = clothing.create(this.product_attribute);
        if(!newClothing){
            throw new BadRequestError('Cannot create new clothing')
        }
        const newProduct = super.createProduct();
        if(!newProduct){
            throw new BadRequestError('Cannot create new product')
        }
        return newProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = clothing.create(this.product_attribute)
        if(!newElectronic){
            throw new BadRequestError('Cannot create new clothing')
        }
        const newProduct = super.createProduct();
        if(!newProduct){
            throw new BadRequestError('Cannot create new product')
        }
        return newProduct;
    }
}

module.exports = new ProductFactory;