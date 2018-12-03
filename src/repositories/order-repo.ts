import BaseRepo from './base-repo';
import { orderModel } from './models';

class OrderRepo extends BaseRepo {

    private Order = this.sequelize.define('order', orderModel);

    createTable = function(forceCreate) {
        return this.Order.sync({force: forceCreate}); // todo: force only during initial development...
    }

    getOrder = function (orderId: Number) {
        let order = this.Order.findById(orderId);
        return this.mapToClientModel(order);
    }

    getOrders = function (filter) {

        filter = filter || {};
        filter.isDeleted = false;

        let orders = this.Order.findAll({
            where:filter,
            order: [
                ['createdAt', 'DESC']
            ]
        });

        return orders.map(o => this.mapToClientModel(o));
    }

    createOrder = function(order) {
        let createdOrder = this.Order.create(this.mapToDbModel(order));
        return this.mapToClientModel(createdOrder);
    }

    // Obsolete ?
    createOrders(orders: any): any {
        let dbModels = orders.map(order => this.mapToDbModel(order));
        return this.Order.bulkCreate(dbModels);
    }

    updateOrderStatus = function(orderId, newStatus) {
        let order = this.Order.update(
            {
                status: newStatus
            },
            {
                returning: true,
                where: { id: orderId }
            }
        );

        return this.mapToClientModel(order);
    }

    addOrderNote = function(orderId: number, orderNotes: Array<any>) {
        let order = this.Order.update(
            {
                notes: orderNotes
            },
            {
                returning: true,
                where: { id: orderId }
            }
        ) 

        return this.mapToClientModel(order);
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

    mapToClientModel = function(order) {
        return {
            id: order.id,
            orderDate: order.orderDate,
            deliveryDate: order.deliveryDate,
            status: order.status,
            type: order.type,
            customer: JSON.parse(order.customer),
            items: JSON.parse(order.items),
            notes: JSON.parse(order.notes),
            isRecurringOrder: order.isRecurringOrder,
            subscriptionId: order.subscriptionId
        }
    }
}

export default new OrderRepo();
