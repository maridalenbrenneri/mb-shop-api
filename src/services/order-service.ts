import { Response } from "express";
import orderRepo  from '../repositories/order-repo';
import { OrderValidator } from '../validators/order-validator';
import { ValidationError } from "../models/validation-error";
import { OrderStatus } from "../constants";

class OrderService {

    createOrder(order: any, res: Response) {
        OrderValidator.validate(order);
        
        order.orderDate = Date.now()
        order.status = "processing";
        order.notes = [];

        return orderRepo.createOrder(order).then(createdOrder => {

            return res.send(createdOrder);

        }).catch(function (err) { 
            // todo: this catch should be handled by global err handler, but doesn't seem to work for some reason...
            if (err instanceof ValidationError) {
                return res.status(422).send({validationError: err.message});
            } 
            return res.status(500).send({error: err.message});
        });
    };

    getOrders(filter = {}) {
        return orderRepo.getOrders(filter);
    }

    updateOrderStatus(orderId: number, newStatus: string, res: Response) {

        return orderRepo.getOrder(orderId).then(function(order) {
            OrderValidator.validateStatus(order.status, newStatus);

            return orderRepo.updateOrderStatus(orderId, newStatus).then(function([ ordersUpdated, [updatedOrder] ]) {

                if (ordersUpdated === 0) {
                    return res.status(404).send();
                } 
          
                return res.send(updatedOrder);
            });
        });
    }

    addOrderNote(orderNote: any, res: any): any {
        
        OrderValidator.validateOrderNote(orderNote);

        return orderRepo.getOrder(orderNote.orderId).then(order=> {
            order.notes.push(orderNote);
            return orderRepo.addOrderNote(order.id, order.notes).then(updatedOrder => {
                return updatedOrder;
            });
        });
    }
}

export default new OrderService();