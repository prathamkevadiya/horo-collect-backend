const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { validateSignUp } = require('../middleware/validationMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication APIs
 */

/**
 * @swagger
 * /api/users/sign-up:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               companyName:
 *                 type: string
 *               companyAddress:
 *                 type: string
 *               registeredLegalNumber:
 *                 type: string
 *               documents:
 *                 type: object
 *               plan:
 *                 type: string
 *               companyLogo:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *               - companyName
 *               - companyAddress
 *               - registeredLegalNumber
 *               - plan
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Server error
 */
router.post('/sign-up', validateSignUp, userController.signUp);

/**
 * @swagger
 * /api/users/sign-in:
 *   post:
 *     summary: User login with email or username and password to generate OTP
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrPhone:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - emailOrUsername
 *               - password
 *     responses:
 *       200:
 *         description: OTP sent to user's email
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/sign-in', userController.signInWithOTP);

/**
 * @swagger
 * /api/users/verify-otp:
 *   post:
 *     summary: Verify OTP for login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               otp:
 *                 type: string
 *             required:
 *               - userId
 *               - otp
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Server error
 */
router.post('/verify-otp', userController.verifyOTP);

/**
 * @swagger
 * /api/users/get-all:
 *   post:
 *     summary: Fetch all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Users fetched successfully
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: JohnDoe
 *                       email:
 *                         type: string
 *                         example: johndoe@example.com
 *                       companyName:
 *                         type: string
 *                         example: TechCorp
 *                       isVerified:
 *                         type: boolean
 *                         example: true
 *                       role_id:
 *                         type: integer
 *                         example: 3
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/get-all', auth, userController.getAllUsers);

/**
 * @swagger
 * /api/users/update-verification-status:
 *   post:
 *     summary: Update the verification status of a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: User verification status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User verification status updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Validation error or user already verified
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/update-verification-status', auth, userController.updateVerificationStatus);



/**
 * @swagger
 * /api/users/delete:
 *   post:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The ID of the user to delete
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       400:
 *         description: Missing or invalid userId.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/delete', auth, userController.deleteUser);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/profile', auth, userController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               companyName:
 *                 type: string
 *               companyAddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/profile', auth, userController.updateProfile);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.put('/change-password', auth, userController.changePassword);

/**
 * @swagger
 * /api/users/sign-out:
 *   post:
 *     summary: User logout
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/sign-out', auth, userController.signOut);

module.exports = router;
