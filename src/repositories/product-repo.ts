import Repo from './repo';
import { productModel } from './models';

class ProductRepo extends Repo {

    private Product = this.sequelize.define('product', productModel);

    createTable = function() {
        return this.Product.sync({force: true}); // todo: force only during initial development...
    }

    getProduct = function (productId: Number) {
        return this.Product.findById(productId);
    }

    getProducts = function (filter) {
        return this.Product.findAll({where:filter});
    }

    createProduct = function(product) {
        return this.Product.create(this.mapToDbModel(product));
    }

    updateProduct = function(productId, product) {
        return this.Product.update(
            this.mapToDbModel(product),
            {
                returning: true,
                where: {id: productId}
            }
        );
    }

    mapToDbModel = function(product) {
        return {
            type: product.type,
            code: product.code,
            name: product.name,
            description: product.description,
            description2: product.description2,
            infoUrl: product.infoUrl,
            price: product.price,
            mva: product.mva,
            isActive: product.isActive,     // todo: Set in seperate function?
            isInStock: product.isInStock,   // todo: Set in seperate function?
            imageKey: product.imageKey
        };
    }
}

export default new ProductRepo();
