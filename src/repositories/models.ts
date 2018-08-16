import { INTEGER, JSON, STRING, DECIMAL, BOOLEAN } from 'sequelize';

export const userModel = {
    email: { type: STRING, unique: true },
    password: { type: STRING, allowNull: false },
    role: { type: STRING, allowNull: false },         // customer, store-manager, admin 
    givenName: { type: STRING, allowNull: false },
    familyName: { type: STRING, allowNull: false },
    phone: { type: STRING }
}

export const productModel = {
    type: { type: STRING },
    code: { type: STRING },
    name: { type: STRING },
    description: { type: STRING },
    description2: { type: STRING },
    infoUrl: { type: STRING },
    price: { type: DECIMAL },
    mva: { type: DECIMAL }, /* percent */
    isActive: { type: BOOLEAN },
    isInStock: { type: BOOLEAN },
    imageKey: { type: STRING }
}

export const orderModel = {
    status: { type: STRING },
    // customerId: { type: INTEGER },
    // customerName: { type: STRING },
    // customerEmail: { type: STRING },
    customer: { type: JSON },
    items: { type: JSON }
}
