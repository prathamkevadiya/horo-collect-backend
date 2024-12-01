const express = require('express');
const { getUploadHistory } = require('../controllers/productController');
const auth = require('../middleware/auth'); // Include authentication middleware if required
const router = express.Router();

/**
 * @swagger
 * /api/upload-history/by-user:
 *   post:
 *     summary: Fetch upload history by user ID
 *     tags: [UploadHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Upload history fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Upload history fetched successfully.
 *                 history:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       fileName:
 *                         type: string
 *                         example: "products.csv"
 *                       uploadDate:
 *                         type: string
 *                         example: "2023-11-19T12:00:00.000Z"
 *                       totalEntries:
 *                         type: integer
 *                         example: 100
 *                       successfulEntries:
 *                         type: integer
 *                         example: 90
 *                       erroredEntries:
 *                         type: integer
 *                         example: 10
 *                       user_id:
 *                         type: integer
 *                         example: 1
 *       400:
 *         description: Missing user_id in request body
 *       404:
 *         description: No upload history found for the given user ID
 *       500:
 *         description: Server error
 */
router.post('/by-user', auth, getUploadHistory);

module.exports = router;
