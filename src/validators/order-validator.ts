import { ValidationError } from "../models/validation-error";

export class OrderValidator {

    static validate(order) {
        if(!order.type) {
            throw new ValidationError("Order doesn't have a type");
        }

        if(!order.customer) {
            throw new ValidationError("Order doesn't contain any customer");
        } 

        if(!order.items || order.items.length === 0) {
            throw new ValidationError("Order doesn't contain any items");
        } 
    }

    static validateStatus(currentStatus: string, newStatus: string) {

        const statuses = ['processing', 'canceled', 'completed'];

        if(!statuses.find(s => s === newStatus)) {
            throw new ValidationError("Invalid order status");
        }

        if(currentStatus === 'canceled' && newStatus === 'completed') {
            throw new ValidationError("It's not allowed to complete a canceled order");
        }

        if(currentStatus === 'completed' && newStatus === 'canceled') {
            throw new ValidationError("It's not allowed to cancel a completed order");
        }
    }

    static validateOrderNote(orderNote: any): any {
        if(!orderNote || !orderNote.orderId || !orderNote.note) {
            throw new ValidationError("Invalid order note");
        }

        if(orderNote.note.length > 2000) {
            throw new ValidationError("Order note exceded maximum length");
        }
    }    

    static validateCustomerOrderNote(orderNote: any): any {
        if(!orderNote || !orderNote.orderId || !orderNote.customerNote) {
            throw new ValidationError("Invalid order customer note");
        }

        if(orderNote.note.length > 3000) {
            throw new ValidationError("Order customer note exceded maximum length");
        }
    }    
}
