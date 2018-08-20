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
        // console.log("order " + JSON.stringify(order));
        // console.log("customer " + JSON.stringify(order.customer));
      //  console.log("givenName: " + order.customer.givenName);
        let customer_json = JSON.stringify(order.customer);
        let items_json = JSON.stringify(order.items);

        return {
            status: 'created',
            customer: customer_json,
            items: items_json
        };
    }
}

export default new OrderRepo();
