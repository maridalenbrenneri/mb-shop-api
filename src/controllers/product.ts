
import { Response, Request } from "express";
import productService from '../services/product-service';

class ProductController {

  /**
   * GET /products/:id
   */
  getProduct = function (req: Request, res: Response) {

    return productService.getProduct(req.body.id, res);
  }

  /**
   * GET /products
   */
  getProducts = function (req: Request, res: Response) {

    return productService.getProducts(res);
  }

  /**
   * POST /products
   */
  createProduct = function (req: Request, res: Response) {

    return productService.createProduct(req.body, res);
  }

  /**
   * PUT /products/:id
   */
  updateProduct = function (req: Request, res: Response) {

    return productService.updateProduct(req.body, res);
  }
}

export default new ProductController();