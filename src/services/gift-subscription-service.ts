import { Response } from "express";
import giftSubscriptionRepo from '../repositories/gift-subscription-repo';
import logger from '../utils/logger';
import wooService from './woo-service';
import { GiftSubscriptionValidator } from "../validators/gift-subscription-validator";

class GiftSubscriptionService {

    getGiftSubscription(giftSubscriptionId: number, res: Response) {
        let self = this;

        return giftSubscriptionRepo.getGiftSubscription(giftSubscriptionId).then(giftSubscription => {
            if (!giftSubscription) {
                return res.status(404).send();
            }

            return res.send(self.mapToClientModel(giftSubscription));

        }).catch(function (err) {
            logger.error(err);
            return res.status(500).send({ error: "An error occured when getting the gift subscription" });
        });
    }

    getGiftSubscriptions(res: Response) {
        let self = this;
        let filter = {};

        return giftSubscriptionRepo.getGiftSubscriptions(filter).then(giftSubscriptions => {

            let clientGiftSubscriptions = giftSubscriptions.map(p => self.mapToClientModel(p));
            return res.send(clientGiftSubscriptions);

        }).catch(function (err) {
            logger.error(err);
            return res.status(500).send({ error: "An error occured when getting the gift subscriptions: " + err });
        });
    }

    createGiftSubscription(giftSubscription: any, res: Response) {
        let self = this;

        GiftSubscriptionValidator.validate(giftSubscription);

        let dbGiftSubscription = self.mapToDbModel(giftSubscription);

        return giftSubscriptionRepo.createGiftSubscription(dbGiftSubscription).then(createdGiftSubscription => {

            return res.send(self.mapToClientModel(createdGiftSubscription));

        }).catch(function (err) {
            logger.error(err);
            return res.status(500).send({ error: "An error occured when creating the gift subscription: " + err });
        });
    }

    updateGiftSubscription(giftSubscription: any, res: Response) {
        let self = this;

        GiftSubscriptionValidator.validate(giftSubscription);

        let dbGiftSubscription = self.mapToDbModel(giftSubscription);

        return giftSubscriptionRepo.updateGiftSubscription(dbGiftSubscription.id, dbGiftSubscription).then(updatedGiftSubscription => {

            return res.send(self.mapToClientModel(updatedGiftSubscription));

        }).catch(function (err) {
            logger.error(err);
            return res.status(500).send({ error: "An error occured when updating the gift subscription: " + err });
        });
    }

    async import(res: Response) {

        giftSubscriptionRepo.getGiftSubscriptions({}).then(giftSubscriptions => {

            wooService.getActiveGiftSubscriptions().then(async wooSubscriptions => {
                
                for(const wooSubscription of wooSubscriptions) {

                    let sub = giftSubscriptions.find(s => s.wooOrderId == wooSubscription);

                    if(!sub) {
                        await giftSubscriptionRepo.createGiftSubscription(wooSubscription);
                    }
                }
            });
            

        }).catch(function (err) {
            logger.error(err);
            return res.status(500).send({ error: "An error occured when getting the gift subscriptions: " + err });
        });

    }

    mapToDbModel = function (giftSubscription) {
        return {
            id: giftSubscription.id,
            wooOrderId: giftSubscription.wooOrderId,
            status: giftSubscription.status,
            orderDate: giftSubscription.orderDate,
            firstDeliveryDate: giftSubscription.firstDeliveryDate,
            lastDeliveryDate: giftSubscription.lastDeliveryDate,
            frequence: giftSubscription.frequence,
            quantity: giftSubscription.quantity,
            customerName: giftSubscription.customerName,
            recipient_address: JSON.stringify(giftSubscription.recipient_address),
            recipient_name: giftSubscription.recipient_name,
            note: giftSubscription.note,
        };
    }

    mapToClientModel = function (giftSubscription) {
        return {
            id: giftSubscription.id,
            wooOrderId: giftSubscription.wooOrderId,
            status: giftSubscription.status,
            orderDate: giftSubscription.orderDate,
            firstDeliveryDate: giftSubscription.firstDeliveryDate,
            lastDeliveryDate: giftSubscription.lastDeliveryDate,
            frequence: giftSubscription.frequence,
            quantity: giftSubscription.quantity,
            customerName: giftSubscription.customerName,
            recipient_address: JSON.parse(giftSubscription.recipient_address),
            recipient_name: giftSubscription.recipient_name,
            note: giftSubscription.note,
        };
    }
}

export default new GiftSubscriptionService();