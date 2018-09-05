class SubscriptionModel {
    id: number;
    parentOrderId: number;
    userId: number;
    frequence: number;
    quantity: number;
    status: string;
    firstDeliveryDate: Date;
    lastDeliveryDate: Date;
    nextDeliverDate: Date;
    endDate: Date;
    isGiftSubscription: boolean;
}