import { JSONB, STRING, DECIMAL, BOOLEAN, INTEGER, DATEONLY } from 'sequelize';

export const userModel = {
    email: { type: STRING, unique: true },
    password: { type: STRING, allowNull: false },
    role: { type: STRING, allowNull: false },         // customer, store-manager, admin 
    givenName: { type: STRING, allowNull: false },
    familyName: { type: STRING, allowNull: false },
    phone: { type: STRING },
    isActive: { type: BOOLEAN, allowNull: false },
    addresses: { type: JSONB }
}

export const productModel = {
    category: { type: STRING, allowNull: false },
    code: { type: STRING, allowNull: false },
    name: { type: STRING, allowNull: false },
    description: { type: STRING },
    description2: { type: STRING },
    infoUrl: { type: STRING },
    price: { type: DECIMAL, allowNull: false },
    taxRate: { type: DECIMAL, allowNull: false },
    isActive: { type: BOOLEAN, allowNull: false },
    isInStock: { type: BOOLEAN, allowNull: false },
    portfolioImageKey: { type: STRING }
}

export const orderModel = {
    status: { type: STRING, allowNull: false },
    customer: { type: JSONB, allowNull: false },
    items: { type: JSONB, allowNull: false }
}

export const subscriptionModel = {
    parentOrderId: { type: INTEGER, allowNull: false },
    status: { type: STRING, allowNull: false},
    frequence: { type: INTEGER, allowNull: false },
    quantity: { type: INTEGER, allowNull: false },
    firstDeliveryDate: { type: DATEONLY, allowNull: false },
    lastDeliveryDate: { type: DATEONLY },
    endDate: { type: DATEONLY },
    isGiftSubscription: { type: BOOLEAN, allowNull: false }
}
