const Product = require('../models/Product');
const UploadHistory = require('../models/UploadHistory');
const multer = require('multer');
const csvParser = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' }).single('file');

// Required fields for product validation
const requiredFields = [
    "Stock ID", "Model No", "Brand", "Gender", "Metal Type", "Case Size (MM)",
    "Condition", "Box", "Paper", "Total Price ($US)", "Launch Year",
    "Image Link", "Video Link", "Location"
];

// Validate product data
const validateProduct = (product) => {
    const missingFields = requiredFields.filter(field => !product[field]);
    if (missingFields.length > 0) return { valid: false, errors: missingFields };
    return { valid: true };
};

// Parse CSV file
const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err));
    });
};

// Parse Excel file
const parseExcel = (filePath) => {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
};

// Get all products for a specific user
exports.getAllProducts = async (req, res) => {
    const userId = req.userId;

    try {
        const products = await Product.findAll({ where: { user_id: userId } });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

// Upload products from CSV/Excel
exports.uploadProducts = async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: 'User ID not found in request' });
    }

    // Validate user existence
    const userExists = await User.findByPk(userId);
    if (!userExists) {
        return res.status(400).json({ message: 'Invalid user ID. User does not exist.' });
    }

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'File upload error', error: err.message });
        }

        const filePath = req.file.path;
        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        let rawData = [];

        try {
            if (fileExtension === '.csv') {
                rawData = await parseCSV(filePath);
            } else if (fileExtension === '.xlsx') {
                rawData = await parseExcel(filePath);
            } else {
                return res.status(400).json({ message: 'Unsupported file format' });
            }

            const validProducts = [];
            const invalidProducts = [];

            rawData.forEach((product) => {
                const validation = validateProduct(product);
                if (validation.valid) {
                    validProducts.push({
                        stock_id: product['Stock ID'] || 'DEFAULT_VALUE',
                        model_no: product['Model No'] || null,
                        brand: product['Brand'] || null,
                        gender: product['Gender'] || null,
                        metal_type: product['Metal Type'] || null,
                        case_size: product['Case Size (MM)'] || null,
                        condition: product['Condition'] || null,
                        box: product['Box'] || null,
                        paper: product['Paper'] || null,
                        total_price: product['Total Price ($US)'] || 0,
                        launch_year: product['Launch Year'] || null,
                        image_link: product['Image Link'] || null,
                        video_link: product['Video Link'] || null,
                        location: product['Location'] || null,
                        visibility: true,
                        user_id: userId, // Attach the user's ID
                    });
                } else {
                    invalidProducts.push({ product, errors: validation.errors });
                }
            });

            // Remove all products for the current user
            await Product.destroy({ where: { user_id: userId } });

            // Save the new products for the current user
            const savedProducts = await Product.bulkCreate(validProducts);

            // Log upload history
            const uploadHistoryEntry = {
                fileName: req.file.originalname,
                uploadDate: new Date(),
                totalEntries: rawData.length,
                successfulEntries: savedProducts.length,
                erroredEntries: invalidProducts.length,
                user_id: userId,
            };

            await UploadHistory.create(uploadHistoryEntry);

            res.status(200).json({
                message: 'File processed successfully',
                totalEntries: rawData.length,
                successfulEntries: savedProducts.length,
                failedEntries: invalidProducts.length,
                errors: invalidProducts,
            });
        } catch (error) {
            console.error('Error processing file:', error);
            res.status(500).json({ message: 'Error processing file', error });
        } finally {
            fs.unlinkSync(filePath); // Clean up uploaded file
        }
    });
};

exports.updateVisibility = async (req, res) => {
    try {
        const { id, visibility } = req.body; // Extract `id` and `visibility` from the request body
        const userId = req.userId; // Assuming userId is set by the auth middleware

        // Check if `visibility` is provided and valid
        if (visibility === undefined) {
            return res.status(400).json({ message: 'Visibility value is required' });
        }

        // Find the product that belongs to the user
        const product = await Product.findOne({
            where: { id, user_id: userId }, // Ensure the product belongs to the authenticated user
        });

        // Handle the case where the product is not found
        if (!product) {
            return res.status(404).json({ message: 'Product not found or access denied' });
        }

        // Update the product's visibility
        product.visibility = visibility; // Update the visibility field
        await product.save(); // Save changes to the database

        // Send success response
        res.status(200).json({ message: 'Product visibility updated successfully', product });
    } catch (error) {
        console.error('Error updating product visibility:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};




// Fetch upload history by user_id
exports.getUploadHistory = async (req, res) => {
    const { user_id } = req.body;

    // Validate the presence of `user_id`
    if (!user_id) {
        return res.status(400).json({ message: 'Missing user_id in request body.' });
    }

    // Validate user existence
    const userExists = await User.findByPk(user_id);
    if (!userExists) {
        return res.status(400).json({ message: 'Invalid user ID. User does not exist.' });
    }

    try {
        // Fetch upload history for the provided user_id
        const history = await UploadHistory.findAll({
            where: { user_id }, // Filter by user_id
            order: [['uploadDate', 'DESC']], // Sort by upload date
            attributes: [
                'id',
                'fileName',
                'uploadDate',
                'totalEntries',
                'successfulEntries',
                'erroredEntries',
                'user_id',
            ], // Only include relevant fields from upload history
        });

        if (history.length === 0) {
            return res.status(404).json({ message: 'No upload history found for the given user ID.' });
        }

        res.status(200).json({
            message: 'Upload history fetched successfully.',
            history,
        });
    } catch (error) {
        console.error('Error fetching upload history:', error);
        res.status(500).json({ message: 'Error fetching upload history.', error });
    }
};






exports.getProductsByUser = async (req, res) => {
    const { user_id } = req.body;

    // Check if user_id is provided
    if (!user_id) {
        return res.status(400).json({ message: 'Missing user_id in request body.' });
    }

    try {
        // Fetch products associated with the given user_id
        const products = await Product.findAll({
            where: { user_id },
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for the given user ID.' });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by user ID:', error);
        res.status(500).json({ message: 'Error fetching products', error });
    }
};