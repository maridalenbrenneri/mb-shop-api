
import { Response, Request } from "express";
import GiftSubscriptionService from '../services/gift-subscription-service';

class GiftSubscriptionController {

  /**
   * GET /GiftSubscriptions/:id
   */
  getGiftSubscription = function (req: Request, res: Response) {

    return GiftSubscriptionService.getGiftSubscription(req.body.id, res);
  }

  /**
   * GET /GiftSubscriptions
   */
  getGiftSubscriptions = function (req: Request, res: Response) {

    return GiftSubscriptionService.getGiftSubscriptions(res);
  }

  /**
   * POST /GiftSubscriptions
   */
  createGiftSubscription = function (req: Request, res: Response) {

    return GiftSubscriptionService.createGiftSubscription(req.body, res);
  }

  /**
   * PUT /GiftSubscriptions/:id
   */
  updateGiftSubscription = function (req: Request, res: Response) {

    return GiftSubscriptionService.updateGiftSubscription(req.body, res);
  }

  /**
   * POST /ImportGiftSubscriptions
   */
  importGiftSubscriptions = function (req: Request, res: Response) {

    return GiftSubscriptionService.import(res);
  }
}

export default new GiftSubscriptionController();