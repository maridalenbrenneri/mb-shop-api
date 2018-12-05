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

        filter = filter || {};
        filter.isDeleted = false;

        return this.Order.findAll({
            where:filter,
            order: [
                ['createdAt', 'DESC']
            ]
        });
    }

    createOrder = function(order) {
        return this.Order.create(order);
    }

    updateOrderStatus = function(orderId, newStatus) {
        return this.Order.update(
            {
                status: newStatus
            },
            {
                returning: true,
                where: { id: orderId }
            }
        );
    }

    addOrderNote = function(orderId: number, orderNotes: Array<any>) {
        return this.Order.update(
            {
                notes: orderNotes
            },
            {
                returning: true,
                where: { id: orderId }
            }
        ).then() 
    }
}

export default new OrderRepo();
