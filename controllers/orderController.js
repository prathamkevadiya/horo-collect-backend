const { Op } = require('sequelize');
const Order = require('../models/Order');

// Create Order
exports.createOrder = async (req, res) => {
    try {
        const { product_id, quantity, price, payment_method, notes } = req.body;
        const userId = req.userId;

        const newOrder = await Order.create({
            customer_id: userId,
            product_id,
            quantity,
            price,
            payment_method,
            notes,
        });

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};

// Get All Orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({ where: { customer_id: req.userId } });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};

// Get Order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { order_id: req.params.id, customer_id: req.userId },
        });

        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { order_id: req.params.id, customer_id: req.userId },
        });

        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.order_status = req.body.order_status;
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error });
    }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { order_id: req.params.id, customer_id: req.userId },
        });

        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.order_status = 'Canceled';
        await order.save();

        res.status(200).json({ message: 'Order canceled successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error canceling order', error });
    }
};
