const express = require('express');
const {
    uploadProducts,
    getAllProducts,
    updateVisibility,
    getUploadHistory,
    getProductsByUser,
    getUploadHistoryByUserId,
    getUploadHistoryByUser
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /api/products/by-user:
 *   post:
 *     summary: Get all products by user ID
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *             required:
 *               - user_id
 *     responses:
 *       200:
 *         description: List of products for the given user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   stock_id:
 *                     type: string
 *                   model_no:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   gender:
 *                     type: string
 *                   metal_type:
 *                     type: string
 *                   case_size:
 *                     type: integer
 *                   condition:
 *                     type: string
 *                   box:
 *                     type: string
 *                   paper:
 *                     type: string
 *                   total_price:
 *                     type: number
 *                   launch_year:
 *                     type: integer
 *                   image_link:
 *                     type: string
 *                   video_link:
 *                     type: string
 *                   location:
 *                     type: string
 *                   visibility:
 *                     type: boolean
 *       400:
 *         description: Missing or invalid user ID
 *       500:
 *         description: Server error
 */
router.post('/by-user', auth, getProductsByUser);

/**
 * @swagger
 * /api/products/upload:
 *   post:
 *     summary: Upload products
 *     description: Upload a CSV or Excel file to add products for the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The CSV or Excel file containing product data.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: File processed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEntries:
 *                   type: integer
 *                 successfulEntries:
 *                   type: integer
 *                 erroredEntries:
 *                   type: integer
 *       400:
 *         description: Bad request. File upload failed or invalid format.
 *       401:
 *         description: Unauthorized. Token missing or invalid.
 */
router.post('/upload', auth, uploadProducts);

/**
 * @swagger
 * /api/products/{id}/visibility:
 *   put:
 *     summary: Update product visibility
 *     description: Update the visibility status (show/hide) of a product.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visibility:
 *                 type: boolean
 *                 description: The new visibility status (true or false).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully updated visibility.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request. Invalid data provided.
 *       401:
 *         description: Unauthorized. Token missing or invalid.
 *       404:
 *         description: Product not found.
 */
router.post('/updateVisibility', auth, updateVisibility);


module.exports = router;
