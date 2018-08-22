import * as EmailValidator from 'email-validator';

class UserValidator {
    static validate(body) {
        console.log(body);
        return this.validateUsernameAndPassword(body.username, body.password);

        // todo: add name etc. ?
    }

    static validateUsernameAndPassword(username, password) {
        return EmailValidator.validate(username) && 
                password && password.length > 5; 
    }

    static validateOrderStatus(status: String) {
        
        return true;

        // todo ...
        // let statuses = ['created', 'payment-failed', 'in-process', 'completed', 'cancelled', 'deleted'];
        // return statuses.includes(status);
    }
}

export default UserValidator;