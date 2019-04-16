import { Response, Request } from "express";
import { CargonizerService, Consignment, ShippingType } from "../services/cargonizer-service";
import giftSubscriptionService from '../services/gift-subscription-service';
import { ControllerHelper } from "./controller-base";
import { Constants } from "../constants";

class ShippingController {

    CreateConsignmentForBusinessOrder = async function (req: Request, res: Response) {
        const cargonizer = new CargonizerService();

        try {
            const order = req.body;

            let weight = 0;
            order.items.forEach(item => {
                weight += (item.productVariation.weight * item.quantity);
            });

            const consignment: Consignment = {
                shippingType: ShippingType.standard_business,
                weight: weight,
                reference: "#" + order.id,
                customer: {
                    email: order.customer.email,
                    phone: order.customer.phone,
                    name: order.customer.name,
                    street1: order.customer.address.street1,
                    street2: order.customer.address.street2,
                    zipCode: order.customer.address.zipCode,
                    place: order.customer.address.place,
                    country: "NO",
                    contactPerson: order.customer.contactPerson
                }
            }

            await cargonizer.requestConsignment(consignment);

            return res.send({ success: true });
        }
        catch (e) {
            return ControllerHelper.handleError(res, e, "Error when creating consignment in Cargonizer");
        }
    }

    CreateConsignmentForGiftSubscription = async function (req: Request, res: Response, next: any) {

        const cargonizer = new CargonizerService();

        try {
            const sub = req.body;

            const consignment: Consignment = {
                shippingType: ShippingType.standard_private,
                weight: sub.quantity * Constants.smallBagFreightWeight,
                reference: "#" + sub.wooOrderNumber + " GABO" + sub.quantity,
                customer: {
                    email: sub.recipient_email,
                    phone: sub.recipient_phone,
                    name: sub.recipient_name,
                    street1: sub.recipient_address.street1,
                    street2: sub.recipient_address.street2,
                    zipCode: sub.recipient_address.zipCode,
                    place: sub.recipient_address.place,
                    country: "NO",
                    contactPerson: sub.recipient_name,
                }
            }

            await cargonizer.requestConsignment(consignment);

            const updatedGiftSubscription = await giftSubscriptionService.setLastOrderCreated(sub.id);

            return res.send(updatedGiftSubscription);
        }
        catch (e) {
            return ControllerHelper.handleError(res, e, "Error when creating consignment in Cargonizer");
        }
    }
}

export default new ShippingController();