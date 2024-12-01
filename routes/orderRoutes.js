const express = require('express');
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
} = require('../controllers/orderController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API to manage orders.
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
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
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *               payment_method:
 *                 type: string
 *                 enum: [Credit Card, PayPal, COD]
 *               notes:
 *                 type: string
 *             required:
 *               - product_id
 *               - quantity
 *               - price
 *               - payment_method
 *     responses:
 *       201:
 *         description: Order created successfully.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
router.post('/', auth, createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
router.get('/', auth, getOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to retrieve
 *     responses:
 *       200:
 *         description: Order details.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id', auth, getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_status:
 *                 type: string
 *                 enum: [Pending, Confirmed, Shipped, Delivered, Canceled]
 *             required:
 *               - order_status
 *     responses:
 *       200:
 *         description: Order status updated successfully.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
router.put('/:id/status', auth, updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the order to cancel
 *     responses:
 *       200:
 *         description: Order canceled successfully.
 *       401:
 *         description: Unauthorized access.
 *       404:
 *         description: Order not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:id', auth, cancelOrder);

module.exports = router;
