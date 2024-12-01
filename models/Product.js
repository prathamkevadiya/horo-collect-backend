const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    stock_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    model_no: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    metal_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    case_size: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    condition: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    box: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    paper: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    launch_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    image_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    video_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    visibility: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Table name for User model
            key: 'id', // Column in User model to reference
        },
    },
}, {
    tableName: 'products',
    timestamps: true,
});

module.exports = Product;
