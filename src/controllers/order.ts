import { Response, Request } from "express";
import orderRepo  from '../repositories/order-repo';
import orderService from "../services/order-service";

class OrderController {

  /**
   * GET /orders/:id
   */
  getOrder = function (req: Request, res: Response, next: any) {

    orderRepo.getOrder(req.params.id).then(order => {
      if (!order) {
        return res.status(404).send("Order was not found.");
      }

      res.send(order);
    });

  }

  /**
   * GET /orders
   */
  getOrders (req: Request, res: Response) {

    orderService.getOrders().then(orders => {
      return res.send(orders);
    });
  }

  /**
   * GET /orders/mine
   */
  getMyOrders (req: Request, res: Response) {

    let filter = { 
      userId: req.user.id
    };

    orderRepo.getOrders(filter).then(orders => {
      res.send(orders);
    });

  }

  /**
   * POST /orders
   */
  createOrder (req: Request, res: Response) {

    return orderService.createOrder(req.body, res);

  }

  /**
   * POST /orders/:id/complete
   */
  completeOrder (req: Request, res: Response, next: any) {

    // todo: check if order is owned by current user (or current user is store-manager) Same for all update functions.

    return orderService.updateOrderStatus(req.params.id, 'completed', res);

  }

  /**
   * POST /orders/:id/complete-and-ship
   */
  completeAndShipOrder (req: Request, res: Response) {

    // todo: call shipping service => then =>

    return orderService.updateOrderStatus(req.params.id, 'completed', res);

  }

}

export default new OrderController();