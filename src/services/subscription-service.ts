import { Response } from "express";
import { SubscriptionDateHelper } from './subscription-date-helper';
import { SubscriptionStatus, ProductCategories } from '../constants';
import subscriptionRepo  from '../repositories/subscription-repo';
import { SubscriptionValidator } from '../validators/subscription-validator';

class SubscriptionService {     

    getSubscriptions(filter: any) {
        return subscriptionRepo.getSubscriptions(filter);
    }

    createSubscriptionFromOrder(order) {
        if(!order.id) {
            throw new Error("Subscription doesn't have a parent order");
        }

        const customer = JSON.parse(order.customer);
        if(!customer || !customer.userId) {
            throw new Error("Subscription doesn't have a customer");
        }

        let subscriptionOptions = this.getSubscriptionOptionsFromOrder(order);

        SubscriptionValidator.validate(subscriptionOptions);

        let subscription = {
            parentOrderId: order.id,
            userId: customer.userId,
            status: SubscriptionStatus.active,
            frequence: subscriptionOptions.frequence,
            quantity: subscriptionOptions.quantity,
            firstDeliveryDate: subscriptionOptions.firstDeliveryDate,
            isGiftSubscription: false
        }

        return subscriptionRepo.createSubscription(subscription);
    }

    updateSubscriptionStatus(subscriptionId: Number, newStatus: String, res: Response) {

        return subscriptionRepo.updateSubscriptionStatus(subscriptionId, newStatus).then(function([subscriptionsUpdated, [updatedSubscription]]) {

            if (subscriptionsUpdated === 0) {
                return res.status(404).send();
            } 
        
            return res.send(updatedSubscription);
        });
    }

    getNextDeliveryDates() : any {
        let monthlyList = SubscriptionDateHelper.getNextDeliveryDatesForMonthly().map(date => date.format());
        let fortnightlyList = SubscriptionDateHelper.getNextDeliveryDatesForFortnightly().map(date => date.format());

        return {
           nextMonthly: SubscriptionDateHelper.getNextDeliveryDateForMonthly().format(),
           nextFortnightly: SubscriptionDateHelper.getNextDeliveryDateForFortnightly().format(),
           nextMonthlyList: monthlyList,
           nextFortnightlyList: fortnightlyList
        }
    }

    doesOrderContainSubscription(order) {
        const items = JSON.parse(order.items);
        if(!items || items.length === 0) {
            return false;
        }

        return items.some(item => item.product.category === ProductCategories.coffeeSubscription);
    }

    private getSubscriptionOptionsFromOrder(order) {
        return JSON.parse(order.items).find(item => item.product.category === ProductCategories.coffeeSubscription).productOptions;
    }
}

export default new SubscriptionService();
