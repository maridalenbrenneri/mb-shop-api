import { Response } from "express";
import { SubscriptionDateHelper } from './subscription-date-helper';
import { SubscriptionStatus, SubscriptionFrequence, Constants, OrderTypes } from '../constants';
import subscriptionRepo  from '../repositories/subscription-repo';
import orderRepo from "../repositories/order-repo";
import logger from '../utils/logger';
import orderService from "./order-service";
import userRepo from "../repositories/user-repo";

class SubscriptionEngineService {  

    createRenewalOrders(res: Response) {

        const nextDeliveryDate = SubscriptionDateHelper.getNextDeliveryDateForFortnightly();
        const nextRenewalDate = SubscriptionDateHelper.getNextCreateRenewalDate(nextDeliveryDate, Constants.subscriptionRenewalPaymentDaysBeforeDelivery);

        if(SubscriptionDateHelper.isTodayBeforeDate(nextRenewalDate)) {
            return res.send(`No renewal orders created, will not create any until ${nextRenewalDate.toString()}`);
        }

        subscriptionRepo.getSubscriptions({status: SubscriptionStatus.active}).then(subscriptions => {
            logger.info(`Start creating renewal orders for ${subscriptions.length} subscriptions.`);

            let result = {
                ordersCreated: Array<Number>(),
                errors: Array<Error>()
            };

            let promises = [];

            for (let subscription of subscriptions) {
                promises.push(this.createRenewalOrder_Step1(subscription, nextDeliveryDate, nextRenewalDate));
            }

            Promise.all(promises).then(() => {
                res.send("Renewal orders created.");

            }).catch(function (err) { 
                logger.error(`Error when creating renewal orders. ${err.message}`);
                return res.status(501).send(err.message);
            });

        }).catch(function (err) { 
            logger.error(`Error when getting subscriptions, couldn't start creating renewal orders. ${err.message}`);
            return res.status(501).send(err.message);
        });
    }

    // Create the order
    private createRenewalOrder_Step3(subscription, customer, nextRenewalDate) {

        logger.debug("Creating order for subscription " + subscription.id);

        let order = {
            type: OrderTypes.renewal,
            subscriptionId: subscription.id,
            orderDate: nextRenewalDate,
            customer: customer,
            items: [{
                quantity: 1,
                product: {
                    name: 'subscription-renewal',
                    quantity: subscription.quantity       
                }
            }]
        };
        
        return orderRepo.createOrder(order).then(createdOrder => {
            logger.info(`Renewal order ${createdOrder.id} was created for subscription ${subscription.id}`); 
        });
    }

    // Gather data need for createing the order
    private createRenewalOrder_Step2 (subscription, nextRenewalDate, result) {
        return userRepo.getUser(subscription.userId).then(customer => {
            return this.createRenewalOrder_Step3(subscription, customer, nextRenewalDate);

        }).catch(function (err) { 
            result.errors.push(err);
        });;
    }

    // Verify that a renewal order should be created for the subscription (it's time and order is not already created)
    private createRenewalOrder_Step1 = function (subscription, nextDeliveryDate, nextRenewalDate) {
        
        if(!this.isTimeForRenewalOrder(nextDeliveryDate, subscription)) {
            logger.debug(`Not yet time for renewal order for subscription id: ${subscription.id}`);
            return;
        }

        return orderService.getOrders({subscriptionId: subscription.id}).then(orders => {
            if(orders.length > 0) {
                let match = orders.find(order => SubscriptionDateHelper.isSameDate(order.orderDate, nextRenewalDate));
                
                if(match.length === 0) {
                    return this.createRenewalOrder_Step2(subscription, nextRenewalDate);
                }

                if(match.length === 1) {
                    logger.debug(`Renewal order for ${nextRenewalDate.toString()} was already created. Subscription id: ${subscription.id}`);
                }

                if(match.length > 1) {
                    let err = new Error(`Duplicate orders found on subscription when creating renewal order. Subscription id: ${subscription.id}`);
                    logger.error(err.message);
                }
            }

        }).catch(function (err) { 
            logger.error(err.message);
        });
    }

    /*
    * Return true if fortnightly, if current date is first of month or it's a monthly subscription with delivery third tuesday
    */ 
    private isTimeForRenewalOrder(nextDeliveryDate, subscription) : Boolean {
        const isNextDeliveryFirstOfMonth = SubscriptionDateHelper.isDateFirstDeliveryOfMonth(nextDeliveryDate);
        return subscription.frequence !== SubscriptionFrequence.monthly || isNextDeliveryFirstOfMonth || !SubscriptionDateHelper.isDateFirstDeliveryOfMonth(subscription.firstDeliveryDate);
    }
}

export default new SubscriptionEngineService();