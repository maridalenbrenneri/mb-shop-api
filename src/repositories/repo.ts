import Sequelize from 'sequelize';

class Repo {
    protected sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
          ssl: true
        }
    });
}

export default Repo;