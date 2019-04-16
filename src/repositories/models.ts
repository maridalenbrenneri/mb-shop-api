import { Sequelize } from 'sequelize'
import { STRING, BOOLEAN, INTEGER, DATEONLY, DATE, TEXT } from 'sequelize';

export const userModel = {
    email: { type: STRING, unique: true },
    password: { type: STRING, allowNull: false },
    role: { type: STRING, allowNull: false },         // admin, super-user, private-customer, business-customer
    customerId: { type: INTEGER, allowNull: true },
    isActive: { type: BOOLEAN, allowNull: false },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
}

export const customerModel = {
    email: { type: STRING, unique: true, allowNull: false },
    name: { type: STRING, allowNull: false },
    organizationNumber: { type: STRING },
    phone: { type: STRING },
    contactPerson: { type: STRING },
    deliveryAddress: { type: TEXT },
    invoiceAddress: { type: TEXT },
    note: { type: STRING },
    type: { type: STRING },
    isActive: { type: BOOLEAN, allowNull: false, defaultValue: true },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
}

export const productModel = {
    category: { type: STRING, allowNull: false },
    data: { type: TEXT },
    productVariations: { type: TEXT },
    infoUrl: { type: STRING },
    vatGroup: { type: STRING, allowNull: false },
    isActive: { type: BOOLEAN, allowNull: false, defaultValue: true },
    isInStock: { type: BOOLEAN, allowNull: false },
    portfolioImageKey: { type: STRING },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
}

export const orderModel = {
    orderDate: { type: DATE, allowNull: false },
    deliveryDate: { type: DATE, allowNull: true },
    status: { type: STRING, allowNull: false },
    customer: { type: TEXT },
    items: { type: TEXT },
    notes: { type: TEXT },
    customerNotes: { type: TEXT },
    parentOrderId: { type: INTEGER.UNSIGNED },
    type: { type: STRING, allowNull: false },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
}

export const giftSubscriptionModel = {
    status: { type: STRING, allowNull: false },
    wooOrderId: { type: INTEGER.UNSIGNED, allowNull: false },
    wooOrderNumber: { type: INTEGER.UNSIGNED, allowNull: false },
    orderDate: { type: DATE, allowNull: false },
    originalFirstDeliveryDate: { type: DATE, allowNull: false }, // The date-time entered by customer (defaults to order date)
    firstDeliveryDate: { type: DATE, allowNull: false },         // The calculated and actual first delivery date
    lastDeliveryDate: { type: DATE, allowNull: false },          // We save last delivery date to make it possible to change (could else be calculated with numberOfMonths)
    numberOfMonths: { type: INTEGER.UNSIGNED, allowNull: false },
    frequence: { type: INTEGER.UNSIGNED, allowNull: false },
    quantity: { type: INTEGER.UNSIGNED, allowNull: false },
    customerId: { type: INTEGER.UNSIGNED },
    customerName: { type: STRING },
    recipient_name: { type: STRING, allowNull: false },
    recipient_email: { type: STRING, allowNull: false },
    recipient_address: { type: TEXT, allowNull: false },
    message_to_recipient: { type: TEXT },
    note: { type: STRING },
    lastOrderCreated: { type: DATE },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
}

export const subscriptionModel = {
    parentOrderId: { type: INTEGER, allowNull: false },
    userId: { type: INTEGER, allowNull: false },
    status: { type: STRING, allowNull: false },
    frequence: { type: INTEGER, allowNull: false },
    quantity: { type: INTEGER, allowNull: false },
    firstDeliveryDate: { type: DATEONLY, allowNull: false },
    lastDeliveryDate: { type: DATEONLY },
    endDate: { type: DATEONLY },
    isGiftSubscription: { type: BOOLEAN, allowNull: false },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
}
