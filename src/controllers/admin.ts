import { Response, Request } from "express";
import logger from '../utils/logger';
import ProductRepo  from '../repositories/product-repo'
import ControllerBase from './controller-base';
import UserRepo from "../repositories/user-repo";

class AdminController extends ControllerBase {

  createTable  = function (req: Request, res: Response) {

    const forceCreate = true; // process.env.FORCE_DB_TABLES

    UserRepo.createTable(forceCreate).then(() => {
      logger.info("user table created");
      res.send("user table created");

    }).catch(function (err) {
      logger.error(err);
      res.status(500).send({error: "An error occured when creating the table [user]"});
    });

    ProductRepo.createTable(false).then(() => {
      logger.info("product table created");
      res.send("product table created");

    }).catch(function (err) {
      logger.error(err);
      res.status(500).send({error: "An error occured when creating the table [user]"});
    });
  }
}

export default new AdminController();
