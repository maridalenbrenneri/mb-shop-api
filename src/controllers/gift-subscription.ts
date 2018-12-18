
import { Response, Request } from "express";
import giftSubscriptionService from '../services/gift-subscription-service';
import { ControllerHelper } from "./controller-base";

class GiftSubscriptionController {

  /**
   * GET /giftsubscriptions/:id
   */
  getGiftSubscription = function (req: Request, res: Response) {

    return giftSubscriptionService.getGiftSubscription(req.body.id, res);
  }

  /**
   * GET /giftsubscriptions
   */
  getGiftSubscriptions = function (req: Request, res: Response) {

    return giftSubscriptionService.getGiftSubscriptions(res);
  }

  /**
   * POST /giftsubscriptions
   */
  createGiftSubscription = function (req: Request, res: Response) {

    return giftSubscriptionService.createGiftSubscription(req.body, res);
  }

  /**
   * PUT /giftsubscriptions/:id/first-delivery-date
   */
  async setFirstDeliveryDate(req: Request, res: Response) {

    try {
      return res.send(await giftSubscriptionService.setFirstDeliveryDate(req.params.id, req.body.firstDeliveryDate));
    }
    catch (e) {
      return ControllerHelper.handleError(res, e, "An error occured when updating the gift subscription");
    }
  }

  /**
   * POST /giftsubscriptions/import
   */
  async importGiftSubscriptions(req: Request, res: Response) {

    try {
      return res.send(await giftSubscriptionService.import());
    }
    catch (e) {
      return ControllerHelper.handleError(res, e, "An error occured when importing gift subscriptions");
    }
  }
}

export default new GiftSubscriptionController();