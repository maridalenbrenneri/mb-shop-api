import { ValidationError } from "../models/validation-error";
import { SubscriptionOptions } from "../models/subscription-options";

export class SubscriptionValidator {
    static validate(subscriptionOptions: SubscriptionOptions) {
        if(!subscriptionOptions) {
            throw new ValidationError("Subscription options is null");
        }
        
        if(!subscriptionOptions.quantity || subscriptionOptions.quantity < 1 ||  subscriptionOptions.quantity > 6) {
            throw new ValidationError("Subscription quantity is invalid, must be 1 to 6 but was " + subscriptionOptions.quantity);
        }

        if(!subscriptionOptions.frequence || subscriptionOptions.frequence < 1 ||  subscriptionOptions.frequence > 2) {
            throw new ValidationError("Subscription quantity is invalid, must be 1 or 2 but was " + subscriptionOptions.frequence);
        }
        
        if(!subscriptionOptions.firstDeliveryDate) {
            // todo: validate valid date...
            throw new ValidationError("Subscription first delivery date is invalid " + subscriptionOptions.firstDeliveryDate);
        }
    }
}