import BaseRepo from './base-repo';
import { customerModel } from './models';

class CustomerRepo extends BaseRepo {

    private Customer = this.sequelize.define('customer', customerModel);

    createTable = function(forceCreate) {
        return this.Customer.sync({force: forceCreate}); 
    }

    getCustomer = function (customerId: Number) {
        return this.Customer.findById(customerId);
    }

    getCustomers = function (filter) {
        filter = filter || {};
        filter.isDeleted = false;

        return this.Customer.findAll({where:filter});
    }

    createCustomer = function(customer) {
        return this.Customer.create(this.mapToDbModel(customer));
    }

    updateCustomer = function(customerId, customer) {
        return this.Customer.update(
            this.mapToDbModel(customer),
            {
                returning: true,
                where: {id: customerId}
            }
        );
    }

    mapToDbModel = function(customer) {
        return {
            email: customer.email,
            name: customer.name,
            organizationNumber: customer.organizationNumber,
            phone: customer.phone,
            contactPerson: customer.contactPerson,
            isActive: customer.isActive
        };
    }
}

export default new CustomerRepo();