import BaseRepo from './base-repo';
import { customerModel } from './models';

class CustomerRepo extends BaseRepo {

    private Customer = this.sequelize.define('customer', customerModel);

    createTable = function(forceCreate) {
        return this.Customer.sync({force: forceCreate}); 
    }

    getCustomer = function (customerId: Number) {
        let customer = this.Customer.findById(customerId);
        return this.mapToClientModel(customer);
    }

    getCustomers = function (filter) {
        filter = filter || {};
        filter.isDeleted = false;

        let dbCustomers = this.Customer.findAll({where:filter});

        return dbCustomers.map(customer => this.mapToClientModel(customer));
    }

    createCustomer = function(customer) {
        return this.Customer.create(this.mapToDbModel(customer));
    }

    updateCustomer = function(customerId, customer) {
        let dbCustomer = this.mapToDbModel(customer);
        return this.Customer.update(
            dbCustomer,
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
            isActive: customer.isActive,
            deliveryAddress: JSON.stringify(customer.deliveryAddress),
            invoiceAddress: JSON.stringify(customer.invoiceAddress),
            note: JSON.stringify(customer.note),
            type: customer.type
        };
    }

    mapToClientModel = function(customer) {

        return {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            organizationNumber: customer.organizationNumber,
            phone: customer.phone,
            contactPerson: customer.contactPerson,
            isActive: customer.isActive,
            deliveryAddress: JSON.parse(customer.deliveryAddress),
            invoiceAddress: JSON.parse(customer.invoiceAddress),
            note: JSON.parse(customer.note),
            type: customer.type
        };
    }
}

export default new CustomerRepo();