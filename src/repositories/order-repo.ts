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
        return this.Order.create(this.mapToDbModel(order));
    }

    createOrders(orders: any): any {
        let dbModels = orders.map(order => this.mapToDbModel(order));
        return this.Order.bulkCreate(dbModels);
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

    mapToDbModel = function(order) {
        return {
            status: 'created',
            type: order.type,
            customer: JSON.stringify(order.customer),
            items: JSON.stringify(order.items)
        };
    }
}

export default new OrderRepo();
