const express = require('express');
const sequelize = require('./config/database');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadHistoryRoutes = require('./routes/uploadHistoryRoutes');
const { swaggerUi, swaggerDocs } = require('./config/swagger');
const orderRoutes = require('./routes/orderRoutes');
const inquiryRoutes = require('./routes/InquiriesRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload-history', uploadHistoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inquiries', inquiryRoutes);


// Database Sync
sequelize.sync({ alter: true }).then(() => console.log('Database connected.'));

// Start Server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
