const express = require('express');
const inquiryController = require('../controllers/InquiriesController');
const router = express.Router();
const auth = require("../middleware/auth")

/**
 * @swagger
 * tags:
 *   name: Inquiries
 *   description: API to manage product inquiries.
 */

/**
 * @swagger
 * /api/inquiries:
 *   post:
 *     summary: Create a new inquiry
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *                 description: The ID of the product.
 *               note:
 *                 type: string
 *                 description: Additional details about the inquiry in JSON format.
 *             required:
 *               - product_id
 *     responses:
 *       201:
 *         description: Inquiry created successfully.
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */
router.post('/',auth, inquiryController.createInquiry);

/**
 * @swagger
 * /api/inquiries/sent:
 *   get:
 *     summary: Get all inquiries for the authenticated user
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all inquiries.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
router.get('/sent',auth, inquiryController.sentInquiries);
/**
 * @swagger
 * /api/inquiries/recive:
 *   get:
 *     summary: Get all inquiries for the authenticated user
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all inquiries.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
router.get('/recive',auth, inquiryController.reciveInquiries);

/**
 * @swagger
 * /api/inquiries/{id}:
 *   get:
 *     summary: Get an inquiry by ID
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the inquiry to retrieve.
 *     responses:
 *       200:
 *         description: Inquiry details.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Inquiry not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id', inquiryController.getInquiryById);

/**
 * @swagger
 * /api/inquiries/{id}:
 *   put:
 *     summary: Update an inquiry
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the inquiry to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: object
 *                 description: Updated details about the inquiry in JSON format.
 *     responses:
 *       200:
 *         description: Inquiry updated successfully.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Inquiry not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/:id', inquiryController.updateInquiry);

/**
 * @swagger
 * /api/inquiries/updatestatus:
 *   post:
 *     summary: Update an inquiry status
 *     tags: [Inquiries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: The ID of the inquiry to update.
 *                 example: 1
 *               status:
 *                 type: string
 *                 description: The new status of the inquiry.
 *                 example: "Accept"
 *     responses:
 *       200:
 *         description: Inquiry updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inquiry updated successfully
 *                 inquiry:
 *                   type: object
 *       401:
 *         description: Unauthorized access.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
 *       404:
 *         description: Inquiry not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inquiry not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating inquiry
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/updatestatus', auth, inquiryController.updateInquiryStatus);


/**
* @swagger
* /api/inquiries/{id}:
*   delete:
*     summary: Delete an inquiry
*     description: Deletes an inquiry by its ID. The request must include a valid bearer token for authentication and the inquiry must belong to the authenticated user.
*     tags: 
*       - Inquiries
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: The ID of the inquiry to delete.
*     responses:
*       200:
*         description: Inquiry deleted successfully.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Inquiry deleted successfully.
*       400:
*         description: Invalid or missing user ID.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: User ID is missing or invalid.
*       401:
*         description: Unauthorized access.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: Unauthorized access.
*       404:
*         description: Inquiry not found.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Inquiry not found or does not belong to you.
*       500:
*         description: Internal server error.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: An error occurred while deleting the inquiry.
*/

router.delete('/:id',auth, inquiryController.deleteInquiry);

/**
 * @swagger
 * /api/inquiries/product/{product_id}:
 *   get:
 *     summary: Get all inquiries for a specific product
 *     tags: [Inquiries]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product for which to fetch inquiries.
 *     responses:
 *       200:
 *         description: List of inquiries for the product.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/product/:product_id', inquiryController.getInquiriesByProduct);

module.exports = router;
