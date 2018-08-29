import { ValidationError } from "../models/validation-error";

export class OrderValidator {
    static validate(order) {
        if(!order.customer) {
            throw new ValidationError("Order doesn't contain any customer");
        } 

        if(!order.items || order.items.length === 0) {
            throw new ValidationError("Order doesn't contain any items");
        } 
    }
}
