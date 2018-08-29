import { Response } from "express";
import orderRepo  from '../repositories/order-repo';
import { OrderValidator } from '../validators/order-validator';
import subscriptionService from "./subscription-service";
import { ProductCategories } from '../constants';
import { ValidationError } from "../models/validation-error";

class OrderService {

    createOrder(order: any, res: Response) {
        OrderValidator.validate(order);
        
        return orderRepo.createOrder(order).then(createdOrder => {

            if (this.doesOrderContainSubscription(order)) {
                return subscriptionService.createSubscription(createdOrder.id, this.getSubscriptionOptionsFromOrder(order)).then(() => {
                    return res.send(createdOrder);
                });
            
            } else {
                return res.send(createdOrder);
            }

        }).catch(function (err) { 
            // todo: this catch should be handled by global err handler, but doesn't seem to work for some reason...
            if (err instanceof ValidationError) {
                return res.status(422).send({validationError: err.message});
            } 
            return res.status(500).send({error: err.message});
        });
    };

    updateOrderStatus(orderId: Number, newStatus: String, res: Response) {
        return orderRepo.updateOrderStatus(orderId, newStatus).then(function([ ordersUpdated, [updatedOrder] ]) {

            if (ordersUpdated === 0) {
                return res.status(404).send();
            } 
      
            return res.send(updatedOrder);
        });
    }

    private doesOrderContainSubscription(order) {
        return order.items.some(item => item.product.category === ProductCategories.coffeeSubscription);
    }

    private getSubscriptionOptionsFromOrder(order) {
        return order.items.find(item => item.product.category === ProductCategories.coffeeSubscription).productOptions;
    }
}

export default new OrderService();