import { Response } from "express";
import orderRepo  from '../repositories/order-repo';
import { OrderValidator } from '../validators/order-validator';
import { ValidationError } from "../models/validation-error";
import { OrderStatus } from "../constants";
import logger from '../utils/logger';

class OrderService {

    createOrder(order: any, res: Response) {
        let self = this;
        OrderValidator.validate(order);
        
        order.orderDate = Date.now()
        order.status = OrderStatus.processing;
        order.notes = [];

        // todo: ...
        order.type = "SINGLE"; // GIFTSUBSCRIPTION-RENEWAL, RENEWAL

        return orderRepo.createOrder(self.mapToDbModel(order)).then(dbOrder => {

            let clientOrder = self.mapToClientModel(dbOrder);

            return res.send(clientOrder);

        }).catch(function (err) { 
            self.handleError(err, res);
        });
    }

    getOrder(orderId: number, res: Response) {
        let self = this;
        return orderRepo.getOrder(orderId).then(dbOrder => {
            if (!dbOrder) {
              return res.status(404).send("Order was not found, order id: " + orderId);
            }
            return res.send(self.mapToClientModel(dbOrder));
          });
    }

    getOrders(res: Response, filter = {}) {
        let self = this;
        return orderRepo.getOrders(filter).then(dbOrders => {
            return res.send(dbOrders.map(order => self.mapToClientModel(order)));
        });
    }

    updateOrderStatus(orderId: number, newStatus: string, res: Response) {
        let self = this;
        
        return orderRepo.getOrder(orderId).then(function(order) {
            OrderValidator.validateStatus(order.status, newStatus);

            return orderRepo.updateOrderStatus(orderId, newStatus).then(updatedOrder => {
          
                return res.send(self.mapToClientModel(updatedOrder));
            });

        }).catch(function (err) {
            self.handleError(err, res);
        });;
    }

    addOrderNote(orderNote: any, res: any): any {
        let self = this;

        OrderValidator.validateOrderNote(orderNote);    

        return orderRepo.getOrder(orderNote.orderId).then(order=> {

            let clientOrder = this.mapToClientModel(order);

            clientOrder.notes.push(orderNote);

            return orderRepo.addOrderNote(order.id, JSON.stringify(clientOrder.notes)).then(updatedOrder => {

                return res.send(self.mapToClientModel(updatedOrder));
            });

        }).catch(function (err) {
            self.handleError(err, res);
        });
    }

    addCustomerOrderNote(orderNote: any, res: any): any {
        let self = this;

        OrderValidator.validateCustomerOrderNote(orderNote);    

        return orderRepo.getOrder(orderNote.orderId).then(order=> {

            let clientOrder = this.mapToClientModel(order);

            return orderRepo.addCustomerOrderNote(order.id, clientOrder.customerNotes).then(updatedOrder => {

                return res.send(self.mapToClientModel(updatedOrder));
            });

        }).catch(function (err) {
            self.handleError(err, res);
        });
    }    

    handleError(err: any, res: Response) {
        if (err instanceof ValidationError) {
            return res.status(422).send({validationError: err.message});
        } 

        logger.error(err);
        return res.status(500).send({ error: "An error occured when updating the order: " + err });
    }
    
    mapToDbModel = function(order) {
        return {
            orderDate: order.orderDate,
            deliveryDate: order.deliveryDate,
            status: order.status,
            type: order.type,
            customer: JSON.stringify(order.customer),
            items: JSON.stringify(order.items),
            notes: JSON.stringify(order.notes),
            customerNotes: JSON.stringify(order.customerNotes),
            isRecurringOrder: order.isRecurringOrder,
            subscriptionId: order.subscriptionId
        };
    }

    mapToClientModel = function(order) {

        return {
            id: order.id,
            orderDate: order.orderDate,
            deliveryDate: order.deliveryDate,
            status: order.status,
            type: order.type,
            customer: JSON.parse(order.customer),
            items: JSON.parse(order.items),
            notes: JSON.parse(order.notes),
            customerNotes: order.customerNotes ? JSON.parse(order.customerNotes) : '',
            isRecurringOrder: order.isRecurringOrder,
            subscriptionId: order.subscriptionId
        }
    }
}

export default new OrderService();