import BaseRepo from './base-repo';
import { productModel } from './models';

class ProductRepo extends BaseRepo {

    private Product = this.sequelize.define('product', productModel);

    createTable = function(forceCreate) {
        return this.Product.sync({force: forceCreate}); // todo: force only during initial development...
    }

    getProduct = function (productId: Number) {
        let dbProduct = this.Product.findById(productId);
        return this.mapToClientModel(dbProduct);
    }

    getProducts = function (filter) {
        let self = this;

        filter = filter || {};
        filter.isDeleted = false;

        let dbProducts = this.Product.findAll({where:filter});
        
        return dbProducts.map(p => self.mapToClientModel(p)); 
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
            category: product.category,
            data: JSON.stringify(product.data),
            productVariations: JSON.stringify(product.productVariations),
            infoUrl: product.infoUrl,
            vatGroup: product.vatGroup,
            isActive: product.isActive,
            isInStock: product.isInStock,   
            portfolioImageKey: product.imageKey
        };
    }

    mapToClientModel = function(product) {
        return {
            id: product.id,
            category: product.category,
            data: JSON.parse(product.data),
            productVariations: JSON.parse(product.productVariations),
            infoUrl: product.infoUrl,
            vatGroup: product.vatGroup,
            isActive: product.isActive,
            isInStock: product.isInStock,   
            portfolioImageKey: product.imageKey
        };
    }    
}

export default new ProductRepo();
