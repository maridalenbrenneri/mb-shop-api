import BaseRepo from './base-repo';
import { orderModel } from './models';

class OrderRepo extends BaseRepo {

    private Order = this.sequelize.define('order', orderModel);

    createTable = function(forceCreate) {
        return this.Order.sync({force: forceCreate}); // todo: force only during initial development...
    }

    getOrder = function (orderId: Number) {
        return this.Order.findById(orderId);
    }

    getOrders = function (filter) {
        return this.Order.findAll({where:filter});
    }

    createOrder = function(order) {
        return this.Order.create(this.mapToDbModel(order));
    }

    mapToDbModel = function(order) {
        console.log("order " + JSON.stringify(order));
        console.log("customer " + JSON.stringify(order.customer));
      //  console.log("givenName: " + order.customer.givenName);
        let json = JSON.stringify(order.customer);

        return {
            status: 'created',
            // customerId: `${order.id}`,
            // customerName: `${order.givenName} ${order.familyName}`,
            // customerEmail: `${order.email}`,
            customer: json,
            items: order.items
        };
    }
}

export default new OrderRepo();
