import BaseRepo from './base-repo';
import { subscriptionModel } from './models';

class SubscriptionRepo extends BaseRepo {
    private Subscription = this.sequelize.define('coffeeSubscription', subscriptionModel);

    createTable = function(forceCreate) {
        return this.Subscription.sync({force: forceCreate});
    }

    getSubscription = function (subscriptionId: Number){
        return this.Subscription.findById(subscriptionId);
    }

    getSubscriptions = function (filter) {
        filter = filter || {};
        filter.isDeleted = false;
        
        return this.Subscription.findAll({
            where:filter,
            order: [
                ['createdAt', 'DESC']
            ]
        });
    }

    createSubscription = function(subscription) {
        return this.Subscription.create(subscription);
    }

    updateSubscriptionStatus = function(subscriptionId, newStatus) {
        return this.Subscription.update(
            {
                status: newStatus
            },
            {
                returning: true,
                where: { id: subscriptionId }
            }
        );
    }
}

export default new SubscriptionRepo();