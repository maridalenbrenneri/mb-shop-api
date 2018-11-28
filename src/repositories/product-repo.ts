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
        filter = filter || {};
        filter.isDeleted = false;
        
        return this.Product.findAll({where:filter});
    }

    createProduct = function(product) {
        return this.Product.create(this.mapToDbModel(product));
    }

    createProducts = function(products) {
        let dbModels = [];

        for(let product of products) {
            dbModels.push(this.mapToDbModel(product));
        };

        return this.Product.bulkCreate(dbModels);
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
            category: product.category,
            data: product.data,
            priceVariations: product.priceVariations,
            infoUrl: product.infoUrl,
            vatGroup: product.vatGroup,
            isActive: product.isActive,
            isInStock: product.isInStock,   
            portfolioImageKey: product.imageKey
        };
    }
}

export default new ProductRepo();
