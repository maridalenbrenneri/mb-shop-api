import BaseRepo from './base-repo';
import { userModel } from './models';

class UserRepo extends BaseRepo {

    private User = this.sequelize.define('user', userModel);

    createTable = function(forceCreate) {
        return this.User.sync({force: forceCreate}); 
    }

    getUser = function (userId: Number) {
        return this.User.findById(userId);
    }

    getUserByEmail = function (email: String) {
        return this.User.findOne({where:{email: email}});
    }

    getUsers = function () {
        return this.User.findAll();
    }

    createUser = function(user) {
        return this.User.create(user);
    }
}

export default new UserRepo();