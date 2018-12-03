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

        // todo: map to client model (JSON.parse on customer and items)

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
            orderDate: order.orderDate,
            deliveryDate: order.deliveryDate,
            status: order.status,
            type: order.type,
            customer: JSON.stringify(order.customer),
            items: JSON.stringify(order.items),
            notes: JSON.stringify(order.notes),
            isRecurringOrder: order.isRecurringOrder,
            subscriptionId: order.subscriptionId
        };
    }
}

export default new OrderRepo();
