import * as EmailValidator from 'email-validator';

class UserValidator {
    static validate(body) {
        return this.validateUsernameAndPassword(body.username, body.password);

        // todo: add name etc. ?
    }

    static validateUsernameAndPassword(username, password) {
        return EmailValidator.validate(username) && 
                password && password.length > 5; 
    }
}

export default UserValidator;