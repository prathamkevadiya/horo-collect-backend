const { Op } = require('sequelize');
const Inquiry = require('../models/Inquiries');
const Product = require('../models/Product'); // Import the Product model
const User = require('../models/User'); // Import the User model
const db = require('../config/database'); // Assuming a database connection module

// Create Inquiry
exports.createInquiry = async (req, res) => {
    try {
        const { product_id, note } = req.body;
        const userId = req.userId || null; // If the user is authenticated

        const newInquiry = await Inquiry.create({
            product_id,
            user_id: userId,
            note,
        });

        res.status(201).json({ message: 'Inquiry created successfully', inquiry: newInquiry });
    } catch (error) {
        res.status(500).json({ message: 'Error creating inquiry', error });
    }
};


exports.sentInquiries = async (req, res) => {
    try {
        // Ensure userId is properly set
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is missing or invalid.' });
        }

        // Perform the query with the corrected syntax
        const [results] = await db.query(
            `
             SELECT 
                products.brand, 
                products.gender, 
                products.total_price, 
                products.launch_year, 
                products.model_no, 
                products.metal_type, 
                products.case_size, 
                products.condition, 
                products.image_link, 
                products.location,
                inquiries.*,
                users.username, 
                users.email, 
                users.companyName, 
                users.companyAddress
            FROM inquiries
            INNER JOIN products ON products.id = inquiries.product_id
            INNER JOIN users ON users.id = inquiries.user_id
            WHERE inquiries.user_id = ${userId}
            `,
            [userId] // Pass userId securely as a parameter
        );

        res.json(results); // Send back the results
    } catch (error) {
        console.error('Database Query Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching inquiries.' });
    }
};

exports.reciveInquiries = async (req, res) => {
    try {
        // Ensure userId is properly set
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is missing or invalid.' });
        }

        // SQL Query with proper JOIN syntax and parameterization
        const sql = `
            SELECT 
                products.brand,
                products.gender,
                products.total_price,
                products.launch_year,
                products.model_no,
                products.metal_type,
                products.case_size,
                products.condition,
                products.image_link,
                products.location,
                inquiries.*,
                users.username,
                users.email,
                users.companyName,
                users.companyAddress
            FROM inquiries
            INNER JOIN products ON inquiries.product_id = products.id
            INNER JOIN users ON products.user_id = users.id
            WHERE inquiries.user_id != ${userId} AND products.user_id = ${userId} AND users.id = ${userId}
        `;

        // Execute the query securely with parameterized inputs
        const [results] = await db.query(sql, [userId, userId, userId]);

        // Respond with the results
        res.json(results);
    } catch (error) {
        console.error('Database Query Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching inquiries.' });
    }
};





// Get All Inquiries for User
// exports.getInquiries = async (req, res) => {
//     try {
//         const inquiries = await Inquiry.findAll({
//             where: { user_id: req.userId }, // Filter by authenticated user
//             include: [
//                 {
//                     model: Product, // Join with the Product table
//                     as: 'product', // Alias defined in the association
//                     where: { id: req.product_id }, // Match product_id from request body to Product table id
//                     attributes: [
//                         'id',
//                         'brand',
//                         'name',
//                         'total_price',
//                         'condition',
//                         'model_no',
//                         'launch_year',
//                         'gender',
//                     ], // Select specific fields from Product
//                     required: true, // Ensures only matching products are included
//                 },
//             ],
//         });

//         res.status(200).json(inquiries);
//     } catch (error) {
//         console.error('Error fetching inquiries:', error);
//         res.status(500).json({ message: 'Error fetching inquiries', error });
//     }
// };

// Get Inquiry by ID
exports.getInquiryById = async (req, res) => {
    try {
        const inquiry = await Inquiry.findOne({
            where: { id: req.params.id, user_id: req.userId }, // Ensure inquiry belongs to user
        });

        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

        res.status(200).json(inquiry);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inquiry', error });
    }
};

exports.updateInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findOne({
            where: { id: req.params.id, user_id: req.userId }, // Ensure inquiry belongs to user
        });

        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

        // Update allowed fields
        inquiry.note = req.body.note || inquiry.note;
        await inquiry.save();

        res.status(200).json({ message: 'Inquiry updated successfully', inquiry });
    } catch (error) {
        res.status(500).json({ message: 'Error updating inquiry', error });
    }
};
exports.updateInquiryStatus = async (req, res) => {
    try {
        const { id, status } = req.body; // Extract `id` and `status` from the request body
        const userId = req.userId; // Assuming userId is set by the auth middleware

        // Find the inquiry that belongs to the user
        const inquiry = await Inquiry.findOne({
            where: { id, user_id: userId }, // Ensure inquiry belongs to the authenticated user
        });

        if (!inquiry) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        // Update the inquiry's status
        inquiry.order_status = status || inquiry.order_status; // Use the provided status, fallback to current status
        await inquiry.save();

        res.status(200).json({ message: 'Inquiry updated successfully', inquiry });
    } catch (error) {
        console.error('Error updating inquiry:', error);
        res.status(500).json({ message: 'Error updating inquiry', error });
    }
};






// Update Inquiry
exports.updateInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findOne({
            where: { id: req.params.id, user_id: req.userId }, // Ensure inquiry belongs to user
        });

        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

        // Update allowed fields
        inquiry.note = req.body.note || inquiry.note;
        await inquiry.save();

        res.status(200).json({ message: 'Inquiry updated successfully', inquiry });
    } catch (error) {
        res.status(500).json({ message: 'Error updating inquiry', error });
    }
};

// Delete Inquiry
exports.deleteInquiry = async (req, res) => {
    try {
        // Ensure userId is properly set
        const { id } = req.params;
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is missing or invalid.' });
        }

        // Perform the query with the corrected syntax
        const [results] = await db.query(
            `DELETE from inquiries WHERE id = ${id}`,
            [id] // Pass userId securely as a parameter
        );

        res.json(results); // Send back the results
    } catch (error) {
        console.error('Database Query Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching inquiries.' });
    }
};


// Get All Inquiries for a Product (Admin/Support)
exports.getInquiriesByProduct = async (req, res) => {
    try {
        const inquiries = await Inquiry.findAll({
            where: { product_id: req.params.product_id }
        });

        res.status(200).json(inquiries);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inquiries', error });
    }
};
