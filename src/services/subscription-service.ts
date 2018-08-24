import * as moment from 'moment';
import { Constants } from '../constants';


class SubscriptionService {     

    getNextDeliveryDates() : any {
        return {
            nextMonthly: SubscriptionDateHelper.getNextDeliveryDateForMonthly().format(),
            nextFortnightly: SubscriptionDateHelper.getNextDeliveryDateForFortnightly().format()
        }
    }
}

class SubscriptionDateHelper {
    static getNextDeliveryDateForMonthly() {
        let dates = this.getAllDatesForDeliveryDayInMonth(moment());

        if(dates[0] < moment()) {
            dates = this.getAllDatesForDeliveryDayInMonth(moment().add(1,'M'))
        }

        return dates[0];
    }

    static getNextDeliveryDateForFortnightly() {
        let now = moment();

        let dates = this.getAllDatesForDeliveryDayInMonth(now);

        let firstThisMonth = dates[0];
        let thirdThisMonth = dates[2];

        if (now < thirdThisMonth) {
            return firstThisMonth;
        
        } else if (now >= thirdThisMonth) {
            // If today has passed 3rd week delivery, next delivery date is set to 1st next month
            dates = this.getAllDatesForDeliveryDayInMonth(moment().add(1,'M'))
            return dates[0]; 
        
        } else {
            return thirdThisMonth;
        }
    }

    private static getAllDatesForDeliveryDayInMonth(date): Array<any> {

        if(!Constants.deliveryDay) {
            throw new Error('Error when calculating dates for delivery days in month. Delivery day not defined.');
        }

        let deliveryDay = date.startOf('month').day(Constants.deliveryDay);
        if (deliveryDay.date() > 7) { // todo: why?
            deliveryDay.add(7,'d');
        }
        
        let month = deliveryDay.month();
        let dates = [];
        while(month === deliveryDay.month()){
            dates.push(deliveryDay.clone());
            deliveryDay.add(7,'d');
        }

        if(dates.length < 4) {
            throw new Error('Error when calculating dates for delivery days in month. From date: ' + date);
        }

        return dates;
    }
}

export default new SubscriptionService();
