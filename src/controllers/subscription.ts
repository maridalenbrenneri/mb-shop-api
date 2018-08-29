import { Response, Request } from "express";
import subscriptionService from "../services/subscription-service";
import logger from '../utils/logger';

class SubscriptionController {
    
    /**
     * GET /subacriptions
     */
    getSubscriptions = function (req: Request, res: Response) {

        let filter = {  };

        subscriptionService.getSubscriptions(filter).then(products => {
        res.send(products);
        });
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

}

export default new SubscriptionController();
