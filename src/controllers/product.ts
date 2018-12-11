
import { Response, Request } from "express";
import productRepo  from '../repositories/product-repo';
import logger from '../utils/logger';

class ProductController {

  /**
   * GET /products/:id
   */
  getProduct = function (req: Request, res: Response, next: any) {

    productRepo.getProduct(req.params.id).then(product => {
      if(!product) {
        res.status(404).send("Product was not found.");  
        return;
      } 

      res.send(product);

    }).catch(function (err) {
      logger.error(err);
      res.status(500).send({error: "An error occured when getting the product"});
    });
  }

  /**
   * GET /products
   */
  getProducts = function (req: Request, res: Response) {

    let filter = {  };

    productRepo.getProducts(filter).then(products => {
      res.send(products);

    }).catch(function (err) {
      logger.error(err);
      res.status(500).send({error: "An error occured when getting the products: "  + err});
    });
  }

  /**
   * POST /products
   */
  createProduct = function (req: Request, res: Response) {

    // todo: validate body content...

    productRepo.createProduct(req.body).then(product => {
      res.send(product);
    
    }).catch(function (err) {
      logger.error(err);
      res.status(500).send({error: "An error occured when creating the product: " + err});
    });
  }

  /**
   * PUT /products/:id
   */
  updateProduct = function (req: Request, res: Response) {

    // todo: validate body content...

    productRepo.updateProduct(req.params.id, req.body)
      .then(function([ rowsUpdate, [updatedProduct] ]) {
        if(!updatedProduct) {
          res.status(404).send("Product was not found");
          return;
        }
        
        res.send(updatedProduct)

      }).catch(function (err) {
        // todo: handle 400 err

        logger.error(err);
        res.status(500).send({error: "An error occured when updating the product: " +  + err});
      });
  }
}

export default new ProductController();