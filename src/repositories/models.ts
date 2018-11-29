import { JSONB, STRING, DECIMAL, BOOLEAN, INTEGER, DATEONLY } from 'sequelize';

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
    deliveryAddress: { type: JSONB },
    invoiceAddress: { type: JSONB },
    note: { type: STRING },
    type: { type: STRING },
    isActive: { type: BOOLEAN, allowNull: false, defaultValue: true  },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
}

export const productModel = {
    category: { type: STRING, allowNull: false },
    data: { type: JSONB, allowNull: false },
    priceVariations: { type: JSONB, allowNull: false }, 
    infoUrl: { type: STRING },
    vatGroup: { type: STRING, allowNull: false },
    isActive: { type: BOOLEAN, allowNull: false },
    isInStock: { type: BOOLEAN, allowNull: false },
    portfolioImageKey: { type: STRING },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
}

export const orderModel = {
    status: { type: STRING, allowNull: false },
    type: { type: STRING, allowNull: false },
    subscriptionId: { type: INTEGER },
    customer: { type: JSONB, allowNull: false },
    items: { type: JSONB, allowNull: false },
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
