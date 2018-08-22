import { Response } from "express";
import orderRepo  from '../repositories/order-repo';

class OrderService {

    updateOrderStatus(orderId: Number, newStatus: String, res: Response) {
        return orderRepo.updateOrderStatus(orderId, newStatus).then(function([ ordersUpdated, [updatedOrder] ]) {

            if (ordersUpdated === 0) {
                return res.status(404).send("Order was not found.");
            } 
      
            return res.send(updatedOrder);
        });
    }
}

export default new OrderService();