import { Response, Request } from "express";
import logger from "utils/logger";
import productRepo  from "../repositories/product-repo"
import ControllerBase from "./controller-base";

class AdminController extends ControllerBase {

  createTable  = function  (req: Request, res: Response) {

    if (!this.verifyApiKey(req)) {
      return;
    }

    if (!this.isUserInAdmin(req)) {
      return;
    }
    
    productRepo.createTable().then(() => {
      logger.info("product table created");

    }).catch(function (err) {
      this.handleError(res, err, "An error occured when creating the table [product]");
    });;
  }

  createProduct = function (req: Request, res: Response) {

    if (!this.verifyApiKey(req)) {
      return;
    }

    if (!this.isUserInStoreManagerOrAbove(req)) {
      return;
    }

    // todo: validate body content...

    productRepo.createProduct(req.body).then(product => {
      res.send(product);
    
    }).catch(function (err) {
      this.handleError(res, err, "An error occured when creating the product");
    });
  }

  updateProduct = function (req: Request, res: Response) {
    res.send("Update not yet implemented");
  }
}

export default new AdminController();
