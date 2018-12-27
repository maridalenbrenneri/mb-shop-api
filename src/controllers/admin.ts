import { Response, Request } from "express";
import logger from '../utils/logger';
import ProductRepo  from '../repositories/product-repo'
import UserRepo from "../repositories/user-repo";
import OrderRepo from "../repositories/order-repo";
import SubscriptionRepo from "../repositories/subscription-repo";
import customerRepo from "../repositories/customer-repo";
import product from "./product";
import giftSubscriptionRepo from "../repositories/gift-subscription-repo";
import dashboardService from "../services/dashboard-service";

class AdminController {

  // WARN: Overrides any exitsting tables
  createTable  = function (req: Request, res: Response) {

    Promise.all([
      // UserRepo.createTable(true), 
      // customerRepo.createTable(true),
      // ProductRepo.createTable(true),
      //OrderRepo.createTable(true),

      //giftSubscriptionRepo.createTable(true)

    ]).then(() => {
      logger.info("Tables created");
      res.send("Tables created");

    }).catch(function (err) {
      logger.error(err);
      res.status(500).send({error: "An error occured when creating the tables. Error: " + err});
    });
  }

  hello = function (req: Request, res: Response) {
    res.send("Hello MB API!");
  }

  testDb  = function (req: Request, res: Response) {
    UserRepo.getUser(1).then(user => {
      user.password = '';
      return res.send(user);

    }).catch(function (err) {
      logger.error(err);
      res.status(500).send({error: "An error occured when getting data. Error: " + err});
    });
  }

  getStats  = async function (req: Request, res: Response) {
    const stats = await dashboardService.getStats();
    res.send(stats);

  }
}

export default new AdminController();
