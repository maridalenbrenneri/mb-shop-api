import BaseRepo from './base-repo';
import { orderModel } from './models';

class OrderRepo extends BaseRepo {

    private Order = this.sequelize.define('order', orderModel);

    createTable = function (forceCreate) {
        return this.Order.sync({ force: forceCreate }); // todo: force only during initial development...
    }

    getOrder = function (orderId: Number) {
        return this.Order.findById(orderId);
    }

    getOrders = function (filter) {

        filter = filter || {};
        filter.isDeleted = false;

        return this.Order.findAll({
            where: filter,
            order: [
                ['createdAt', 'DESC']
            ]
        });
    }

    createOrder = function (order) {
        return this.Order.create(order);
    }

    updateOrderStatus = function (orderId, newStatus) {

        return this.Order.findById(orderId).then(order => {

            return order.update(
                {
                    status: newStatus
                });
        });
    }

    addOrderNote = function (orderId: number, orderNotes: string) {
        return this.Order.findById(orderId).then(order => {

            return order.update(
                {
                    notes: orderNotes
                });
        });
    }

    addCustomerOrderNote = function (orderId: number, customerOrderNotes: string) {
        return this.Order.findById(orderId).then(order => {

            return order.update(
                {
                    customerNotes: customerOrderNotes
                });
        });
    }
}

export default new OrderRepo();
