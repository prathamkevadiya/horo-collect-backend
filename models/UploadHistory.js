const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as needed

const UploadHistory = sequelize.define('UploadHistory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    uploadDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    totalEntries: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    successfulEntries: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    erroredEntries: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Table name for User model
            key: 'id', // Column in the User model to reference
        },
        onUpdate: 'CASCADE', // Update behavior
        onDelete: 'CASCADE', // Delete behavior
    },
}, {
    tableName: 'upload_history',
    timestamps: true,
});

module.exports = UploadHistory;
