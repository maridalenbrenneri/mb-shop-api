import { Response, Request } from "express";
import logger from '../utils/logger';
import productRepo  from '../repositories/product-repo'
import ControllerBase from './controller-base';

class AdminController extends ControllerBase {

  createTable  = function (req: Request, res: Response) {

    productRepo.createTable().then(() => {
      logger.info("product table created");
      res.send("product table created");

    }).catch(function (err) {
      logger.error(err);
      res.status(500).send({error: "An error occured when creating the table [product]"});
    });
  }
}

export default new AdminController();
