
import { Response, Request } from "express";
import productRepo  from "../repositories/product-repo"
import ControllerBase from "./controller-base";

class ProductController extends ControllerBase {

  /**
   * GET /products/:id
   */
  getProduct = function (req: Request, res: Response) {
  
    if(!this.verifyApiKey(req)) {
      return;
    }

    productRepo.getProduct(req.params.id).then(product => {
      if(!product) {
        res.status(404).send("Product was not found.");  
        return;
      } 

      res.send(product);

    }).catch(function (err) {
      this.handleError(res, err, "An error occured when getting the product");
    });
  }

  /**
   * GET /products
   */
  getAllProducts = function (req: Request, res: Response) {
    res.send("getAllProducts not yet implemented...");
  }
}

export default new ProductController();