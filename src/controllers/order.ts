import { Response, Request } from "express";
import orderRepo  from '../repositories/order-repo';
import orderService from "../services/order-service";
import { OrderStatus } from "../constants";

class OrderController {

  /**
   * GET /orders/:id
   */
  getOrder = function (req: Request, res: Response, next: any) {

    orderService.getOrder(req.params.id, res).then(order => {
      return res.send(order);
    });

  }

  /**
   * GET /orders
   */
  getOrders (req: Request, res: Response) {

    return orderService.getOrders(res);
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

    return orderService.updateOrderStatus(req.params.id, "completed", res);

  }

  /**
   * POST /orders/:id/cancel
   */
  cancelOrder (req: Request, res: Response, next: any) {

    return orderService.updateOrderStatus(req.params.id, "canceled", res);

  }

   /**
   * POST /orders/:id/process
   */
  processOrder (req: Request, res: Response, next: any) {

    return orderService.updateOrderStatus(req.params.id, "processing", res);

  }

  /**
   * POST /orders/:id/notes
   */
  addOrderNote (req: Request, res: Response, next: any) {

    return orderService.addOrderNote(req.body, res);

  }

  /**
   * POST /orders/:id/customernotes
   */
  addCustomerOrderNote (req: Request, res: Response, next: any) {

    return orderService.addCustomerOrderNote(req.body, res);

  }  

}

export default new OrderController();