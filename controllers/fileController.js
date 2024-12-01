const fs = require('fs');
const csv = require('csv-parser');
const Product = require('../models/Product'); // Assuming Product is a model for inventory

exports.uploadFile = async (req, res) => {
    try {
        const filePath = req.file.path;

        const products = [];
        const errors = [];
        let totalEntries = 0;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                totalEntries++;
                if (!row.name || !row.price) {
                    errors.push(row);
                } else {
                    products.push(row);
                }
            })
            .on('end', async () => {
                await Product.bulkCreate(products);

                res.status(200).json({
                    message: 'File processed',
                    totalEntries,
                    successful: products.length,
                    errors
                });
            });
    } catch (error) {
        res.status(500).json({ message: 'Error processing file', error });
    }
};
