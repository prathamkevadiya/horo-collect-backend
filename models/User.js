const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: { // Primary key
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    companyAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    registeredLegalNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    documents: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    plan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    companyLogo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'roles', // Table name for Role model (if applicable)
            key: 'id', // Primary key in Role model
        },
    },
}, { timestamps: true });

module.exports = User;
