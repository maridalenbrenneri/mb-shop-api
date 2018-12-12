import BaseRepo from './base-repo';
import { productModel } from './models';

class ProductRepo extends BaseRepo {

    private Product = this.sequelize.define('product', productModel);

    createTable = function(forceCreate) {
        return this.Product.sync({force: forceCreate}); // todo: force only during initial development...
    }

    getProduct = function (productId: Number) {
        return this.Product.findById(productId);
    }

    getProducts = function (filter) {
        let self = this;

        filter = filter || {};
        filter.isDeleted = false;

        return this.Product.findAll({where:filter});
    }

    createProduct = function(product) {
        return this.Product.create(product);
    }

    updateProduct = function(productId, product) {
        return this.Product.findById(productId).then(dbProduct => {
            return dbProduct.update(product);
        });
    }
}

export default new ProductRepo();
