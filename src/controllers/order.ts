
import { Response, Request } from "express";
import orderRepo  from '../repositories/order-repo';
import logger from '../utils/logger';

class OrderController {

  /**
   * GET /orders/:id
   */
  getOrder = function (req: Request, res: Response, next: any) {

    orderRepo.getOrder(req.params.id).then(order => {
      if(!order) {
        res.status(404).send("Order was not found.");  
        return;
      } 

      res.send(order);

    }).catch(function (err) {
      logger.error(err);
      res.status(500).send({error: "An error occured when getting the order: " +  + err});
    });
  }

  /**
   * GET /orders
   */
  getOrders = function (req: Request, res: Response) {

    let filter = { };

    orderRepo.getOrders(filter).then(orders => {
      res.send(orders);

    }).catch(function (err) {
      logger.error(err);
      res.status(500).send({error: "An error occured when getting the orders: " +  + err});
    });
  }

  /**
   * POST /orders
   */
  createOrder = function (req: Request, res: Response) {

    // todo: validate body content...

    orderRepo.createOrder(req.body).then(order => {
      res.send(order);
    
    }).catch(function (err) {
      logger.error(err);
      res.status(500).send({error: "An error occured when creating the order: "  + err});
    });
  }
}

export default new OrderController();