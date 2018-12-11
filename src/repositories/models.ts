import Sequlize from 'sequelize'
import { STRING, BOOLEAN, INTEGER, DATEONLY, DATE, TEXT} from 'sequelize';

export const userModel = {
    email: { type: STRING, unique: true },
    password: { type: STRING, allowNull: false }, 
    role: { type: STRING, allowNull: false },         // admin, super-user, private-customer, business-customer
    customerId: {type: INTEGER, allowNull: true },
    isActive: { type: BOOLEAN, allowNull: false },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
}

export const customerModel = {
    email: { type: STRING, unique: true, allowNull: false },
    name: { type: STRING, allowNull: false },
    organizationNumber: { type: STRING },
    phone: { type: STRING },
    contactPerson: {type: STRING },
    deliveryAddress: { type: Sequlize.TEXT },
    invoiceAddress: { type: Sequlize.TEXT },
    note: { type: STRING },
    type: { type: STRING },
    isActive: { type: BOOLEAN, allowNull: false, defaultValue: true  },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
}

export const productModel = {
    category: { type: STRING, allowNull: false },
    data: { type: Sequlize.TEXT  },
    productVariations: { type: Sequlize.TEXT }, 
    infoUrl: { type: STRING },
    vatGroup: { type: STRING, allowNull: false },
    isActive: { type: BOOLEAN, allowNull: false, defaultValue: true },
    isInStock: { type: BOOLEAN, allowNull: false },
    portfolioImageKey: { type: STRING },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
}

export const orderModel = {
    orderDate: {type: DATE, allowNull: false },
    deliveryDate: {type: DATE, allowNull: true },
    status: { type: STRING, allowNull: false },
    customer: { type: Sequlize.TEXT },
    items: { type: Sequlize.TEXT },
    notes: { type: Sequlize.TEXT },
    isRecurringOrder: { type: BOOLEAN, allowNull: false, defaultValue: false },
    subscriptionId: { type: INTEGER, allowNull: true },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
}

export const subscriptionModel = {
    parentOrderId: { type: INTEGER, allowNull: false },
    userId: { type: INTEGER, allowNull: false },
    status: { type: STRING, allowNull: false},
    frequence: { type: INTEGER, allowNull: false },
    quantity: { type: INTEGER, allowNull: false },
    firstDeliveryDate: { type: DATEONLY, allowNull: false },
    lastDeliveryDate: { type: DATEONLY },
    endDate: { type: DATEONLY },
    isGiftSubscription: { type: BOOLEAN, allowNull: false },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
}
