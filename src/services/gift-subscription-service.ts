import { Response } from "express";
import giftSubscriptionRepo from '../repositories/gift-subscription-repo';
import logger from '../utils/logger';
import wooService from './woo-service';
import { GiftSubscriptionValidator } from "../validators/gift-subscription-validator";
import moment = require("moment");

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

    async getGiftSubscriptions() {
        let self = this;
        let filter = {};

        return await giftSubscriptionRepo.getGiftSubscriptions(filter).then(giftSubscriptions => {

            return giftSubscriptions.map(p => self.mapToClientModel(p));
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

    setLastOrderCreated(giftSubscriptionId: number): any {
        return giftSubscriptionRepo.updateGiftSubscription(giftSubscriptionId, {
            lastOrderCreated: moment().toDate()
        });
    }

    setFirstDeliveryDate(giftSubscriptionId: number, date: Date): any {

        GiftSubscriptionValidator.validateFirstDeliveryDate(date);

        return giftSubscriptionRepo.updateGiftSubscription(giftSubscriptionId, {
            firstDeliveryDate: date
        });
    }

    async import() {

        let importedCount = 0;

        const giftSubscriptions = await giftSubscriptionRepo.getGiftSubscriptions({});
        const wooSubscriptions = await wooService.getActiveGiftSubscriptions();

        for (const wooSubscription of wooSubscriptions) {

            let sub = giftSubscriptions.find(s => s.wooOrderId == wooSubscription.wooOrderId);

            if (!sub) {
                await giftSubscriptionRepo.createGiftSubscription(wooSubscription);
                importedCount++;
            }
        }

        return { count: importedCount };
    }

    mapToDbModel = function (giftSubscription) {
        return {
            id: giftSubscription.id,
            wooOrderId: giftSubscription.wooOrderId,
            wooOrderNumber: giftSubscription.wooOrderNumber,
            status: giftSubscription.status,
            orderDate: giftSubscription.orderDate,
            originalFirstDeliveryDate: giftSubscription.originalFirstDeliveryDate,
            firstDeliveryDate: giftSubscription.firstDeliveryDate,
            lastDeliveryDate: giftSubscription.lastDeliveryDate,
            numberOfMonths: giftSubscription.numberOfMonths,
            frequence: giftSubscription.frequence,
            quantity: giftSubscription.quantity,
            customerName: giftSubscription.customerName,
            recipient_name: giftSubscription.recipient_name,
            recipient_email: giftSubscription.recipient_email,
            recipient_address: JSON.stringify(giftSubscription.recipient_address),
            message_to_recipient: giftSubscription.message_to_recipient,
            note: giftSubscription.note,
            lastOrderCreated: giftSubscription.lastOrderCreated
        };
    }

    mapToClientModel = function (giftSubscription) {
        return {
            id: giftSubscription.id,
            wooOrderId: giftSubscription.wooOrderId,
            wooOrderNumber: giftSubscription.wooOrderNumber,
            status: giftSubscription.status,
            orderDate: giftSubscription.orderDate,
            originalFirstDeliveryDate: giftSubscription.originalFirstDeliveryDate,
            firstDeliveryDate: giftSubscription.firstDeliveryDate,
            lastDeliveryDate: giftSubscription.lastDeliveryDate,
            numberOfMonths: giftSubscription.numberOfMonths,
            frequence: giftSubscription.frequence,
            quantity: giftSubscription.quantity,
            customerName: giftSubscription.customerName,
            recipient_name: giftSubscription.recipient_name,
            recipient_email: giftSubscription.recipient_email,
            recipient_address: JSON.parse(giftSubscription.recipient_address),
            message_to_recipient: giftSubscription.message_to_recipient,
            note: giftSubscription.note,
            lastOrderCreated: giftSubscription.lastOrderCreated
        };
    }

}

export default new GiftSubscriptionService();