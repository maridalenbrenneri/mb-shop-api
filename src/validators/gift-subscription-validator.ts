import { ValidationError } from "../models/validation-error";

export class GiftSubscriptionValidator {

    static validate(giftSubscription) {
        if(!giftSubscription) {
            throw new ValidationError();
        }
    }
}