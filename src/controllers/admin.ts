import { Response, Request } from "express";
import logger from '../utils/logger';
import ProductRepo  from '../repositories/product-repo'
import UserRepo from "../repositories/user-repo";
import OrderRepo from "../repositories/order-repo";
import ControllerBase from './controller-base';
import SubscriptionRepo from "../repositories/subscription-repo";
import customerRepo from "../repositories/customer-repo";

class AdminController extends ControllerBase {

  createTable  = function (req: Request, res: Response) {

    Promise.all([
      // UserRepo.createTable(true), 
      // customerRepo.createTable(true),
    //  ProductRepo.createTable(true),
      OrderRepo.createTable(true),
      
      //SubscriptionRepo.createTable(true)

    ]).then(() => {
      logger.info("Tables created");
      res.send("Tables created");

    }).catch(function (err) {
      logger.error(err);
      res.status(500).send({error: "An error occured when creating the tables. Error: " + err});
    });
  }
}

export default new AdminController();
