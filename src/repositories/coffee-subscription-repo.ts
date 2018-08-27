import BaseRepo from './base-repo';
import { coffeeSubscriptionModel } from './models';
import { SubscriptionStatus } from "../constants";

class CoffeeSubscriptionRepo extends BaseRepo {
    private CoffeeSubscription = this.sequelize.define('coffeeSubscription', coffeeSubscriptionModel);

    createTable = function(forceCreate) {
        return this.CoffeeSubscription.sync({force: forceCreate});
    }

    getSubscription = function (subscriptionId: Number) {
        return this.CoffeeSubscription.findById(subscriptionId);
    }

    getSubscriptions = function (filter) {
        return this.CoffeeSubscription.findAll({where:filter});
    }

    createSubscription = function(subscription) {
        subscription.status = SubscriptionStatus.active;

        return this.CoffeeSubscription.create(this.mapToDbModel(subscription));
    }

    updateOrderStatus = function(subscriptionId, newStatus) {
        return this.CoffeeSubscription.update(
            {
                status: newStatus
            },
            {
                returning: true,
                where: { id: subscriptionId }
            }
        );
    }

    mapToDbModel = function(subscription) {
        return {
            parentOrderId: subscription.parentOrderId,
            status: subscription.status,
            frequency: subscription.frequency,
            quantity: subscription.quantity,
            isGiftSubscription: subscription.isGiftSubscription
        };
    }
}

export default new CoffeeSubscriptionRepo();