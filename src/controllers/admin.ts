import { Response, Request } from "express";
import logger from '../utils/logger';
import ProductRepo  from '../repositories/product-repo'
import UserRepo from "../repositories/user-repo";
import OrderRepo from "../repositories/order-repo";
import ControllerBase from './controller-base';

class AdminController extends ControllerBase {

  createTable  = function (req: Request, res: Response) {

    const forceCreate = true; // process.env.FORCE_DB_TABLES

    Promise.all([
      UserRepo.createTable(true), 
      ProductRepo.createTable(false),
      OrderRepo.createTable(true)

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
