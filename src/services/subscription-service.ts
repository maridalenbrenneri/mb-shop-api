import { SubscriptionDateHelper } from './subscription-date-helper';
import { SubscriptionStatus } from '../constants';
import subscriptionRepo  from '../repositories/subscription-repo';
import { SubscriptionValidator } from '../validators/subscription-validator';
import { SubscriptionOptions } from '../models/subscription-options';

class SubscriptionService {     

    getSubscriptions(filter: any) {
        return subscriptionRepo.getSubscriptions(filter);
    }

    createSubscription(parentOrderId: Number, subscriptionOptions: SubscriptionOptions) {
        
        if(!parentOrderId) {
            throw new Error("Subscription doesn't have a parent order");
        }

        SubscriptionValidator.validate(subscriptionOptions);

        let subscription = {
            parentOrderId: parentOrderId,
            status: SubscriptionStatus.active,
            frequence: subscriptionOptions.frequence,
            quantity: subscriptionOptions.quantity,
            firstDeliveryDate: subscriptionOptions.firstDeliveryDate,
            isGiftSubscription: false
        }

        return subscriptionRepo.createSubscription(subscription);
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
}

export default new SubscriptionService();
