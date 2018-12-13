import { Response } from "express";
import * as moment from 'moment';
import * as https from 'https';

const WOO_API_BASE_URL = 'https://maridalenbrenneri.no/wp-json/wc/v2/';
const WOO_SUBSCRIPTION_API_BASE_URL = 'https://maridalenbrenneri.no/wp-json/wc/v1/';
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

            for (const item of order.line_items) {
                if (item.product_id === GIFT_SUBSCRIPTION_GIFT_ID) {

                    const startDateString = this.resolveMetadataValue(item.meta_data, 'abo_start');

                    const length = this.resolveMetadataValue(item.meta_data, 'antall-maneder');

                    const startDate = moment(startDateString, 'DD.MM.YYYY');

                    const activeFrom = moment(startDate).add(-7, 'days');
                    const activeTo = moment(activeFrom).add(+length, 'months');

                    const today = moment().startOf('day');

                    item.orderId = orderId;

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

    private mapFromWooToDbModel(wooGiftSubscriptionOrder: any) {
        const model = {
            wooOrderId: wooGiftSubscriptionOrder.orderId,
            status: 'active', // wooGiftSubscriptionOrder.status,
            orderDate: new Date(), // wooGiftSubscriptionOrder.orderDate,
            firstDeliveryDate: new Date(), // wooGiftSubscriptionOrder.firstDeliveryDate,
            lastDeliveryDate: new Date(), // wooGiftSubscriptionOrder.lastDeliveryDate,
            frequence: 'monthly', // wooGiftSubscriptionOrder.frequence,
            quantity: 1,
            recipient_address: JSON.stringify({street: 'Qwerty'}),
            recipient_name: 'Qwerty',
            customerName: 'Qwerty',
            note: wooGiftSubscriptionOrder.note,
        }

        return model;
    }    
}

export default new WooService();