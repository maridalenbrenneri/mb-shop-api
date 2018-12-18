import { Response, Request } from "express";
import { CargonizerService, ShippingCustomerInfo, ShippingType } from "../services/cargonizer-service";
import giftSubscriptionService from '../services/gift-subscription-service';

class ShippingController {

     CreateConsignmentForGiftSubscription = async function(req: Request, res: Response, next: any) {

        const giftSubscription = req.data;
        const cargonizer = new CargonizerService();

        const customerInfo: ShippingCustomerInfo = {
            email: "dsa",
            phone: "string",
            name: "string",
            street1: "string",
            street2: "",
            zipCode: "0467",
            place: "string",
            country: "no",	
            contactPerson: "",
            reference: "GABO2"
        }

        try {

            const result = await cargonizer.requestConsignment(customerInfo, ShippingType.standard_private, 1.2);

            await giftSubscriptionService.setLastOrderCreated(giftSubscription.id);

            return res.send(result);
        } 
        catch (e) {
            return res.status(500).send(e);
        }
    }
}

export default new ShippingController();