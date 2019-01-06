export class Constants {
    static readonly deliveryDay = 2; // Tuesday
    static readonly subscriptionRenewalPaymentDaysBeforeDelivery = 14;
    static readonly minPasswordLength = 5;
    static readonly smallBagFreightWeight = 300; 
}

export class TaxRates {
    static readonly coffee = 0.15;
    static readonly standard = 0.25;
}

export class FreightRates {
    static readonly standard = 40;
    static readonly standard_subscription = 30;
}

export class ProductCategories {
    static readonly coffee = 'coffee';
    static readonly coffeeSubscription = 'coffee-subscription';
    static readonly coffeeGiftSubscription = 'coffee-gift-subscription';
}

export class OrderTypes {
    static readonly normal = 'normal';
    static readonly renewal = 'renewal';
}

export class OrderStatus {
    static readonly created = 'created';
    static readonly processing = 'processing';
    static readonly completed = 'completed';
    static readonly canceled = 'canceled';
}

export class SubscriptionFrequence {
    static readonly monthly = 1;
    static readonly fortnightly = 2;
}

export class SubscriptionStatus {
    static readonly active = 'active';
    static readonly onHold = 'on-hold';
    static readonly pendingCancel = 'pending-cancel';
    static readonly cancelled = 'cancelled';
}