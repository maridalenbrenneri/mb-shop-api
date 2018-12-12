import { Response } from "express";
import productRepo from '../repositories/product-repo';
import logger from '../utils/logger';
import { ProductValidator } from "../validators/product-validator";

class ProductService {

    getProduct = function (productId: number, res: Response) {
        let self = this;

        return productRepo.getProduct(productId).then(product => {
            if (!product) {
                return res.status(404).send();
            }

            return res.send(self.mapToClientModel(product));

        }).catch(function (err) {
            logger.error(err);
            return res.status(500).send({ error: "An error occured when getting the product" });
        });
    }

    getProducts = function (res: Response) {
        let self = this;
        let filter = {};

        return productRepo.getProducts(filter).then(products => {

            let clientProducts = products.map(p => self.mapToClientModel(p));
            return res.send(clientProducts);

        }).catch(function (err) {
            logger.error(err);
            return res.status(500).send({ error: "An error occured when getting the products: " + err });
        });
    }

    createProduct = function (product: any, res: Response) {
        let self = this;

        ProductValidator.validate(product);

        let dbProduct = self.mapToDbModel(product);

        return productRepo.createProduct(dbProduct).then(createdProduct => {

            return res.send(self.mapToClientModel(createdProduct));

        }).catch(function (err) {
            logger.error(err);
            return res.status(500).send({ error: "An error occured when creating the product: " + err });
        });
    }

    updateProduct = function (product: any, res: Response) {
        let self = this;

        ProductValidator.validate(product);

        let dbProduct = self.mapToDbModel(product);

        return productRepo.updateProduct(dbProduct.id, dbProduct).then(updatedProduct => {

            return res.send(self.mapToClientModel(updatedProduct));

        }).catch(function (err) {
            logger.error(err);
            return res.status(500).send({ error: "An error occured when updating the product: " + err });
        });
    }

    mapToDbModel = function (product) {
        return {
            id: product.id,
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

    mapToClientModel = function (product) {
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

export default new ProductService();