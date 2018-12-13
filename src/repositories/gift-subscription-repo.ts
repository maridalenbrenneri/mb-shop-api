import BaseRepo from './base-repo';
import { giftSubscriptionModel } from './models';

class GiftSubscriptionRepo extends BaseRepo {

    private GiftSubscription = this.sequelize.define('gift-subscription', giftSubscriptionModel);

    createTable = function(forceCreate) {
        return this.GiftSubscription.sync({force: forceCreate}); // todo: force only during initial development...
    }

    getGiftSubscription = function (giftSubscriptionId: Number) {
        return this.GiftSubscription.findById(giftSubscriptionId);
    }

    getGiftSubscriptions = function (filter) {
        let self = this;

        filter = filter || {};
        filter.isDeleted = false;

        return this.GiftSubscription.findAll({where:filter});
    }

    createGiftSubscription = function(giftSubscription) {
        return this.GiftSubscription.create(giftSubscription);
    }

    updateGiftSubscription = function(giftSubscriptionId, giftSubscription) {
        return this.GiftSubscription.findById(giftSubscriptionId).then(dbGiftSubscription => {
            return dbGiftSubscription.update(giftSubscription); 
        });
    }
}

export default new GiftSubscriptionRepo();
