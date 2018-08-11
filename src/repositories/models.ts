import { STRING, DECIMAL, BOOLEAN } from 'sequelize';

export const userModel = {
    providerId: { type: STRING },
    provider: { type: STRING },     // wordpress, etc.
    role: { type: STRING },         // customer, store-manager, admin 
    givenName: { type: STRING },
    familyName: { type: STRING },
    email: { type: STRING }
}

export const productModel = {
    type: {
        type: STRING
    },
    code: {
        type: STRING
    },
    name: {
        type: STRING
    },
    description: {
        type: STRING
    },
    description2: {
        type: STRING
    },
    infoUrl: {
        type: STRING
    },
    price: {
        type: DECIMAL
    },
    mva: { /* percent */
        type: DECIMAL
    },
    isActive: {
        type: BOOLEAN
    },
    isInStock: {
        type: BOOLEAN
    },
    imageKey: {
        type: STRING
    }
}
