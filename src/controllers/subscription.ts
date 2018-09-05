import { Response, Request } from "express";
import subscriptionService from "../services/subscription-service";
import subscriptionEngineService from "../services/subscription-engine-service";
import logger from '../utils/logger';
import { SubscriptionStatus } from "../constants";

class SubscriptionController {
    
    /**
     * GET /subacriptions
     */
    getSubscriptions = function (req: Request, res: Response) {

        let filter = {  };

        subscriptionService.getSubscriptions(filter).then(subscriptions => {
            res.send(subscriptions);
        });
    }

    /**
     * GET /subacriptions/mine
     */
    getMySubscriptions = function (req: Request, res: Response) {

        let filter = { 
            userId: req.user.id
        };

        subscriptionService.getSubscriptions(filter).then(subscriptions => {
            res.send(subscriptions);
        });
    }

    /**
     * POST /subscriptions/:id/activate
     */
    activateSubscription  = function (req: Request, res: Response) {

        // todo: check if subscription is owned by current user (or current user is store-manager) Same for all update functions...

        return subscriptionService.updateSubscriptionStatus(req.params.id, SubscriptionStatus.active, res);
    }

    /**
     * POST /subscriptions/:id/pause
     */
    pauseSubscription  = function (req: Request, res: Response) {
        return subscriptionService.updateSubscriptionStatus(req.params.id, SubscriptionStatus.onHold, res);
    }

    /**
     * POST /subscriptions/:id/cancel
     */
    startCancelSubscription  = function (req: Request, res: Response) {
        return subscriptionService.updateSubscriptionStatus(req.params.id, SubscriptionStatus.pendingCancel, res);
    } 
    
    /**
     * POST /subscriptions/:id/complete-cancel
     */
    completeCancelSubscription  = function (req: Request, res: Response) {
        return subscriptionService.updateSubscriptionStatus(req.params.id, SubscriptionStatus.cancelled, res);
    } 

    /**
     * GET /subscription/data/delivery-dates
     */
    getNextStandardDeliveryDates = function (req: Request, res: Response, next: any) {

        try {
            let result = subscriptionService.getNextDeliveryDates();
            res.send(result);
        }
        catch(err) {
            logger.error(err);
            res.status(500).send({error: err});
        };

    }
    
    /********************************/
    /* Subscription Engine Functions
    /********************************/

    /*
     * POST /subscription/engine/create-renewal-orders
     */
    createRenewalOrders  = function (req: Request, res: Response) {
        return subscriptionEngineService.createRenewalOrders(res);
    }

}

export default new SubscriptionController();
