import { Response, Request } from "express";
import { CargonizerService, ShippingCustomerInfo, ShippingType } from "../services/cargonizer-service";
import giftSubscriptionService from '../services/gift-subscription-service';
import { ControllerHelper } from "./controller-base";

class ShippingController {

     CreateConsignmentForGiftSubscription = async function(req: Request, res: Response, next: any) {

        const sub = req.body;
        const cargonizer = new CargonizerService();

        // const customerInfo: ShippingCustomerInfo = {
        //     email: sub.recipient_email,
        //     phone: sub.recipient_phone,
        //     name: sub.recipient_name,
        //     street1: sub.recipient_address.street1,
        //     street2: sub.recipient_address.street2,
        //     zipCode: sub.recipient_address.zipCode,
        //     place: sub.recipient_address.place,
        //     country: "no",	
        //     contactPerson: sub.recipient_name,
        //     reference: "GABO" + sub.quantity,
        // }

        const customerInfo = new ShippingCustomerInfo();
        customerInfo.zipCode = "0467";

        try {

            const result = await cargonizer.requestConsignment(customerInfo, ShippingType.standard_private, 1.2);

            // todo: Validate result from cargonizer..? 

            return res.send(result);
            // return res.send(await giftSubscriptionService.setLastOrderCreated(sub.id));
        } 
        catch (e) {
            return ControllerHelper.handleError(res, e, "Error when creating consignment in Cargonizer");
        }
    }
}

export default new ShippingController();