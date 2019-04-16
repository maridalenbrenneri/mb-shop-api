import { Sequelize } from 'sequelize';

class BaseRepo {
    protected sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'mysql',
        dialectOptions: {

        }
    });
}

export default BaseRepo;