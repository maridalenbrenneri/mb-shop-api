import { ValidationError } from "../models/validation-error";

export class ProductValidator {

    static validate(product) {
        if(!product.data) {
            throw new ValidationError("Product must have product data");
        }
    }
}