import Sequelize, { STRING } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: true
    }
});

const Product = sequelize.define('product', {
    type: {
        type: STRING
    },
    name: {
        type: STRING
    },
    description: {
        type: STRING
    }
});

export function createDb() {
    // Test connection
    // sequelize
    //     .authenticate()
    //     .then(() => {
    //         console.log('Connection has been established successfully.');
    //     })
    //     .catch(err => {
    //         console.error('Unable to connect to the database:', err);
    //     });

    Product.sync({force: true}).then(() => {
        console.log("product table created");
    });
}

export function addProduct(product) {
    return Product.create(product);
}

export function getStuff() {

}
