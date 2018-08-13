import Sequelize from 'sequelize';

class BaseRepo {
    protected sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
          ssl: true
        }
    });
}

export default BaseRepo;