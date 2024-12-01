const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    order_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Table name for User model
            key: 'id', // Column in the User model to reference
        },
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products', // Table name for Product model
            key: 'id', // Column in the Product model to reference
        },
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    order_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    delivery_date: { type: DataTypes.DATE, allowNull: true },
    payment_method: {
        type: DataTypes.ENUM('Credit Card', 'PayPal', 'COD'),
        allowNull: false,
    },
    payment_status: {
        type: DataTypes.ENUM('Paid', 'Pending', 'Failed'),
        defaultValue: 'Pending',
    },
    transaction_id: { type: DataTypes.STRING, allowNull: true },
    order_status: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Canceled'),
        defaultValue: 'Pending',
    },
    tracking_number: { type: DataTypes.STRING, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
}, { timestamps: false });

module.exports = Order;
