import * as moment from 'moment';
import * as https from 'https';
import { SubscriptionFrequence } from "../constants";
import logger from "../utils/logger";
import { SubscriptionDateHelper } from './subscription-date-helper';

const WOO_API_BASE_URL = 'https://maridalenbrenneri.no/wp-json/wc/v2/';
//const WOO_SUBSCRIPTION_API_BASE_URL = 'https://maridalenbrenneri.no/wp-json/wc/v1/';
const GIFT_SUBSCRIPTION_GIFT_ID = 968;

class WooService {

    getActiveGiftSubscriptions() {
        let self = this;
        const url = WOO_API_BASE_URL + 'orders?' + process.env.WOO_SECRET_PARAM + '&product=' + GIFT_SUBSCRIPTION_GIFT_ID;

        return new Promise<Array<any>>(function(resolve, reject) {

            https.get(url, (orderResponse) => {

                if(orderResponse.statusCode == 401) {
                    reject(new Error('Not authorized with Woo'))
                }
    
                orderResponse.setEncoding('utf8');
                let rawData = '';
                orderResponse.on('data', (chunk) => { rawData += chunk; });
                orderResponse.on('end', () => {
                  try {
                    const activeSubscriptions = self.filterActiveGiftSubscriptions(JSON.parse(rawData));
                    const models =  activeSubscriptions.map(s => self.mapFromWooToDbModel(s));
                    resolve(models);
                    
                  } catch (e) {
                    reject(e)
                  }
                });
    
            }).on('error', (e) => {
                reject(e);
            });
        });
    }

    private filterActiveGiftSubscriptions(orders: any) : Array<any> {

        const activeGiftSubscriptions = new Array<any>();

        for (const order of orders) {

            const orderId = order.id;
            const orderNote = order.customer_note;
            const orderDate = order.date_created;
            const orderCustomerName = order.billing.first_name + ' ' + order.billing.last_name;

            for (const item of order.line_items) {
                if (item.product_id === GIFT_SUBSCRIPTION_GIFT_ID) {

                    const startDateString = this.resolveMetadataValue(item.meta_data, 'abo_start');

                    const length = this.resolveMetadataValue(item.meta_data, 'antall-maneder');

                    const startDate = moment(startDateString, 'DD.MM.YYYY');

                    const activeFrom = moment(startDate).add(-7, 'days');
                    const activeTo = moment(activeFrom).add(+length, 'months');

                    const today = moment().startOf('day');

                    item.orderId = orderId;
                    item.orderDate = orderDate;
                    item.orderNote = orderNote
                    item.orderCustomerName = orderCustomerName;

                    if (today <= activeTo) {
                        activeGiftSubscriptions.push(item);
                    }
                }
            }
        }

        return activeGiftSubscriptions;
    }

    private resolveMetadataValue(meta_data: Array<any>, key: string) {
        const res = meta_data.find(data => data.key === key);
        return !res ? null : res.value;
    }

    private mapFromWooToDbModel(orderItem: any) {

        const nrOfMonths = +this.resolveMetadataValue(orderItem.meta_data, 'antall-manader');

        const frequency = this.resolveMetadataValue(orderItem.meta_data, 'levering').includes('Annenhver uke') 
                            ? SubscriptionFrequence.fortnightly 
                            : SubscriptionFrequence.monthly;

        // todo: Handle norwegian format "01.01.2018" AND normal format, could come in both...

        let startDate = moment(this.resolveMetadataValue(orderItem.meta_data, 'abo_start'));
        if(!startDate.isValid()) {
            logger.warn("Invalid start date for gift subscription found when importing, woo order id " + orderItem.orderId);
            startDate = moment();
        }
        const firstDeliveryDate = this.resolveNextDeliveryDate(startDate.toDate(), frequency);
        
        let endDate = moment(startDate).add(nrOfMonths, 'M');
        if(!endDate.isValid()) {
            logger.warn("Invalid end date for gift subscription found when importing, woo order id " + orderItem.orderId);
            endDate = moment();
        }
        const lastDeliveryDate = this.resolveNextDeliveryDate(endDate.toDate(), frequency);

        const model = {
            wooOrderId: orderItem.orderId,
            status: 'n/a',
            orderDate: orderItem.orderDate,
            firstDeliveryDate: firstDeliveryDate,
            lastDeliveryDate: lastDeliveryDate,
            frequence: frequency,
            numberOfMonths: nrOfMonths,
            quantity: +this.resolveMetadataValue(orderItem.meta_data, 'poser'),
            customerName: orderItem.orderCustomerName,
            recipient_name: this.resolveMetadataValue(orderItem.meta_data, 'abo_name'),
            recipient_email: this.resolveMetadataValue(orderItem.meta_data, 'abo_email'),
            recipient_address: JSON.stringify({
                street1: this.resolveMetadataValue(orderItem.meta_data, 'abo_address1'),
                street2: this.resolveMetadataValue(orderItem.meta_data, 'abo_address2'),
                zipCode: this.resolveMetadataValue(orderItem.meta_data, 'abo_zip'),
                place: this.resolveMetadataValue(orderItem.meta_data, 'city')
            }), 
            message_to_recipient: this.resolveMetadataValue(orderItem.meta_data, 'abo_msg_retriever'),
            note: orderItem.orderNote
        }

        return model;
    }    

    private resolveNextDeliveryDate(fromDate: Date, frequency: number) : Date {
        return frequency == SubscriptionFrequence.fortnightly 
                ? SubscriptionDateHelper.getNextDeliveryDateForFortnightly(fromDate)
                : SubscriptionDateHelper.getNextDeliveryDateForMonthly(fromDate);
    }
}

export default new WooService();