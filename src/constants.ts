export class Constants {
    static deliveryDay = 2; // Tuesday
    static minPasswordLength = 5;
}

export class TaxRates {
    static coffee = 0.15;
    static standard = 0.25;
}

export class FreightRates {
    static standard = 40;
    static standard_subscription = 30;
}

export class ProductCategories {
    static coffee = 'coffee';
    static coffeeSubscription = 'coffee-subscription';
    static coffeeGiftSubscription = 'coffee-gift-subscription';
}

export class SubscriptionIntervals {
    static monthly = 'monthly';
    static fortnightly = 'fortnightly';
}

export class SubscriptionStatus {
    static active = 'active';
    static onHold = 'on-hold';
    static pendingCancel = 'pending-cancel';
    static cancelled = 'cancelled';
}