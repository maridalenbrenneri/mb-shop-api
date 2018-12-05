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

        return orderRepo.createOrder(this.mapToDbModel(order)).then(dbOrder => {

            let clientOrder = this.mapToClientModel(dbOrder);

            return res.send(clientOrder);

        }).catch(function (err) { 
            // todo: this catch should be handled by global err handler, but doesn't seem to work for some reason...
            if (err instanceof ValidationError) {
                return res.status(422).send({validationError: err.message});
            } 
            return res.status(500).send({error: err.message});
        });
    };

    getOrder(orderId: number, res: Response) {
        return orderRepo.getOrder(orderId).then(dbOrder => {
            if (!dbOrder) {
              return res.status(404).send("Order was not found, order id: " + orderId);
            }
            return res.send(this.mapToClientModel(dbOrder));
          });
    }

    getOrders(res: Response, filter = {}) {
        return orderRepo.getOrders(filter).then(dbOrders => {
            return res.send(dbOrders.map(order => this.mapToClientModel(order)));
        });
    }

    updateOrderStatus(orderId: number, newStatus: string, res: Response) {

        return orderRepo.getOrder(orderId).then(function(order) {
            OrderValidator.validateStatus(order.status, newStatus);

            return orderRepo.updateOrderStatus(orderId, newStatus).then(function([ ordersUpdated, [updatedOrder] ]) {

                if (ordersUpdated === 0) {
                    return res.status(404).send();
                } 
          
                return res.send(this.mapToClientModel(updatedOrder));
            });
        });
    }

    addOrderNote(orderNote: any, res: any): any {
        
        OrderValidator.validateOrderNote(orderNote);

        return orderRepo.getOrder(orderNote.orderId).then(order=> {
            // let notes = JSON.parse(order.notes);
            order.notes.push(orderNote);

            return orderRepo.addOrderNote(order.id, order.notes).then(updatedOrder => {
                return res.send(this.mapToClientModel(updatedOrder));
            });
        });
    }
    
    private mapToDbModel = function(order) {
        return {
            orderDate: order.orderDate,
            deliveryDate: order.deliveryDate,
            status: order.status,
            type: order.type,
            customer: order.customer,
            items: order.items,
            notes: order.notes,
            isRecurringOrder: order.isRecurringOrder,
            subscriptionId: order.subscriptionId
        };
    }

    private mapToClientModel = function(order) {
        return {
            id: order.id,
            orderDate: order.orderDate,
            deliveryDate: order.deliveryDate,
            status: order.status,
            type: order.type,
            customer: order.customer,
            items: order.items,
            notes: order.notes,
            isRecurringOrder: order.isRecurringOrder,
            subscriptionId: order.subscriptionId
        }
    }
}

export default new OrderService();