import { STRING, DECIMAL, BOOLEAN } from 'sequelize';
import Repo from './repo';

class ProductRepo extends Repo {

    private Product = this.sequelize.define('product', {
        type: {
            type: STRING
        },
        name: {
            type: STRING
        },
        description: {
            type: STRING
        },
        description2: {
            type: STRING
        },
        price: {
            type: DECIMAL
        },
        taxClass: { /* standard, coffee */
            type: STRING
        },
        isActive: {
            type: BOOLEAN
        },
        isInStock: {
            type: BOOLEAN
        },
        imageKey: {
            type: STRING
        }
    });

    createTable = function() {
        return this.Product.sync({force: true}); // todo: force only during initial development...
    }

    getProduct = function (productId: Number) {
        return this.Product.findById(productId);
    }

    createProduct = function(product) {
        return this.Product.create({
            type: product.type,
            name: product.name,
            description: product.description,
            description2: product.description2,
            price: product.price,
            taxClass: product.taxClass,
            isActive: product.isActive,     // todo: Set in seperate function?
            isInStock: product.isInStock,   // todo: Set in seperate function?
            imageKey: product.imageKey
        });
    }

    updateProduct = function(product) {
        
    }
}

export default new ProductRepo();
