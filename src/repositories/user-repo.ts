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

    getUsers = function (filter) {
        return this.User.findAll({where:filter});
    }

    createUser = function(user) {
        return this.User.create(this.mapToDbModel(user));
    }

    updateUser = function(userId, user) {
        return this.User.update(
            this.mapToDbModel(user),
            {
                returning: true,
                where: {id: userId}
            }
        );
    }

    mapToDbModel = function(user) {
        return {
            email: user.email,
            password: user.password,
            givenName: user.givenName,
            familyName: user.familyName,
            phone: user.phone,
            role: user.role
        };
    }
}

export default new UserRepo();