import * as moment from 'moment';
import { Constants } from '../constants';

export class SubscriptionDateHelper {
    static getNextDeliveryDateForMonthly(originDate = null) {
        let origin = !originDate ? moment() : moment(originDate);

        let dates = this.getAllDatesForDeliveryWeekdayInMonth(origin);

        if(dates[0].date() <= origin.date()) {
            dates = this.getAllDatesForDeliveryWeekdayInMonth(moment(origin).add(1,'M'))
        }

        return dates[0].clone();
    }

    static getNextDeliveryDatesForMonthly() : Array<any> {

        let dates = [];

        let date1 = SubscriptionDateHelper.getNextDeliveryDateForMonthly();
        let date2 = SubscriptionDateHelper.getNextDeliveryDateForMonthly(date1);
        let date3 = SubscriptionDateHelper.getNextDeliveryDateForMonthly(date2);

        dates.push(date1);
        dates.push(date2);
        dates.push(date3);

        return dates;
    }

    static getNextDeliveryDateForFortnightly(originDate = null) {
        let origin = !originDate ? moment() : moment(originDate);

        let dates = this.getAllDatesForDeliveryWeekdayInMonth(origin);

        let firstThisMonth = dates[0];
        let thirdThisMonth = dates[2];

        if (origin.date() >= firstThisMonth.date() && origin.date() < thirdThisMonth.date())  {
            // If origin date is between 1st and 3rd 
            return thirdThisMonth;
        
        }  else if (origin.date() >= thirdThisMonth.date()) {
            // If origin date has passed 3rd, next delivery will be set to 1st in next month
            dates = this.getAllDatesForDeliveryWeekdayInMonth(moment(origin).add(1,'M'))
            return dates[0]; 
        
        } else {
            // If origin date is before 1st
            return firstThisMonth;
        }
    }

    static getNextDeliveryDatesForFortnightly() : Array<any> {

        let dates = [];

        let date1 = SubscriptionDateHelper.getNextDeliveryDateForFortnightly();
        let date2 = SubscriptionDateHelper.getNextDeliveryDateForFortnightly(date1);
        let date3 = SubscriptionDateHelper.getNextDeliveryDateForFortnightly(date2);
        let date4 = SubscriptionDateHelper.getNextDeliveryDateForFortnightly(date3);
        let date5 = SubscriptionDateHelper.getNextDeliveryDateForFortnightly(date4);
        let date6 = SubscriptionDateHelper.getNextDeliveryDateForFortnightly(date5);

        dates.push(date1);
        dates.push(date2);
        dates.push(date3);
        dates.push(date4);
        dates.push(date5);
        dates.push(date6);

        return dates;
    }

    private static getAllDatesForDeliveryWeekdayInMonth(date): Array<any> {

        if(!Constants.deliveryDay) {
            throw new Error('Error when calculating dates for delivery days in month. Delivery day not defined.');
        }

        let deliveryDay = moment(date).startOf('month').day(Constants.deliveryDay);
        if (deliveryDay.date() > 7) {
            deliveryDay.add(7,'d');
        }
        
        let month = deliveryDay.month();
        let dates = [];
        while(month === deliveryDay.month()){
            dates.push(deliveryDay.clone());
            deliveryDay.add(7,'d');
        }

        if(dates.length < 4) {
            throw new Error('Error when calculating dates for delivery days in month.');
        }

        return dates;
    }
}