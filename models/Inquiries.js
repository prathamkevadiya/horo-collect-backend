const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inquiry = sequelize.define('Inquiry', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    create_time: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW, 
        comment: 'Create Time' 
    },
    product_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        references: {
            model: 'products', // Table name for Product model
            key: 'id', // Column in the Product model to reference
        },
        comment: 'Reference to the Product'
    },
    user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true, 
        references: {
            model: 'users', // Table name for User model
            key: 'id', // Column in the User model to reference
        },
        comment: 'Reference to the User'
    },
    note: { 
        type: DataTypes.TEXT, 
        allowNull: true, 
        comment: 'Additional notes or details in JSON format' 
    },
    order_status: {
        type: DataTypes.ENUM('Pending', 'Accept', 'Reject'),
        defaultValue: 'Pending',
    },
}, { 
    timestamps: false, 
    tableName: 'inquiries', 
    comment: 'Table to store product inquiries'
});

module.exports = Inquiry;
