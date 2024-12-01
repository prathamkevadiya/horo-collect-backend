const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op, UUIDV4 } = require('sequelize');
const User = require('../models/User');
const { google } = require('googleapis');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// Initialize OAuth2 client
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Create a reusable email transporter using OAuth2
const createTransporter = async () => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        return nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER, // Your email address
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });
    } catch (error) {
        console.error('Failed to create email transporter:', error.message);
        throw new Error('Error creating email transporter');
    }
};

// Helper function to send emails
const sendEmail = async (email, subject, message) => {
    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: message,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Failed to send email:', error.message);
        throw new Error('Error sending email');
    }
};

// Temporary store for OTPs (replace with a database for production)
const otpStore = new Map();

// Sign-Up
exports.signUp = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            companyName,
            companyAddress,
            registeredLegalNumber,
            plan,
        } = req.body;

        if (!username || !password || !companyName || !companyAddress || !registeredLegalNumber || !plan) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Validate phone number
        const parsedPhoneNumber = parsePhoneNumberFromString(registeredLegalNumber);
        if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
            return res.status(400).json({ message: 'Invalid phone number format' });
        }

        // Ensure the username or phone number isn't already registered
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { username },
                    { email },
                    { registeredLegalNumber: parsedPhoneNumber.formatInternational() },
                ],
            },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Username, email, or phone number is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            companyName,
            companyAddress,
            registeredLegalNumber: parsedPhoneNumber.formatInternational(),
            plan,
            role_id: 3, // Default role
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Sign-In with OTP
// Sign-In with OTP
exports.signInWithOTP = async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;

        if (!emailOrPhone || !password) {
            return res.status(400).json({ message: 'Both email/phone and password are required' });
        }

        // Find user by email or username
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: emailOrPhone }, { registeredLegalNumber : emailOrPhone }],
            },
        });

        
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or phone' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate OTP
        const generatedOtp = crypto.randomInt(100000, 999999).toString();

        // Store OTP in a temporary map
        otpStore.set(user.id, { otp: generatedOtp, expiresAt: Date.now() + 5 * 60 * 1000 });

        // Send OTP email
        await sendEmail(user.email, "DZG Bestätigungs-Code.",
            `
            <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 40px auto;
                    background: #ffffff;
                    padding: 20px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                    color: #4CAF50;
                    margin-bottom: 20px;
                }
                .content {
                    font-size: 16px;
                    color: #333;
                    line-height: 1.6;
                }
                .otp {
                    display: inline-block;
                    background: #f4f4f4;
                    color: #333;
                    font-size: 24px;
                    font-weight: bold;
                    padding: 10px 20px;
                    border: 1px dashed #ccc;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                .footer {
                    font-size: 14px;
                    color: #777;
                    text-align: center;
                    margin-top: 20px;
                }
                .footer a {
                    color: #4CAF50;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">Your OTP Code</div>
                <div class="content">
                    <p>Hello,</p>
                    <p>Use the following One-Time Password (OTP) to complete your verification process. This code is valid for the next 10 minutes.</p>
                    <div class="otp">${generatedOtp}</div>
                    <p>If you did not request this OTP, please ignore this email or contact support if you have any concerns.</p>
                </div>
                <div class="footer">
                    <p>Thank you,</p>
                    <p><strong>Your Company Name</strong></p>
                    <p><a href="https://yourcompanywebsite.com">Visit Our Website</a></p>
                </div>
            </div>
        </body>
        </html>
            `
        );


        res.status(200).json({
            message: 'OTP sent to your email. Please verify.',
            userId: user.id, // Ensure this is returned
        });
    } catch (error) {
        console.error('Error during OTP generation:', error);
        res.status(500).json({ message: 'Error generating OTP', error: error.message });
    }
};



// Verify OTP
// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        if (!userId || !otp) {
            return res.status(400).json({ message: 'User ID and OTP are required' });
        }

        const storedOtpData = otpStore.get(userId);
        if (!storedOtpData) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        if (storedOtpData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        if (Date.now() > storedOtpData.expiresAt) {
            otpStore.delete(userId);
            return res.status(400).json({ message: 'OTP has expired' });
        }

        otpStore.delete(userId);

        const user = await User.findByPk(userId);
        const token = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id, }, JWT_SECRET, {
            expiresIn: '24h',
        });

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error('Error during OTP verification:', error);
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
};


// Sign-In
exports.signIn = async (req, res) => {
    try {
        const { emailOrPhone, password } = req.body;

        // Check if emailOrPhone and password are provided
        if (!emailOrPhone || !password) {
            return res.status(400).json({ message: 'Both email/phone and password are required' });
        }

        // Find the user by either email or phone
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: emailOrPhone },  // Match email
                    { registeredLegalNumber : emailOrPhone }  // Match phone number
                ],
            },
        });

        // If no user is found
        if (!user) {
            return res.status(400).json({ message: 'Invalid email/phone or password' });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email/phone or password' });
        }

        // Generate a token
        const token = jwt.sign(
            { id: user.id, email: user.email, phone: user.registeredLegalNumber  },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Return success response with the token
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ message: 'Error signing in', error: error.message });
    }
};



// Verification Status
exports.updateVerificationStatus = async (req, res) => {
    try {
        const { userId } = req.body;

        // Check if userId is provided
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find the user by ID
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is already verified
        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' });
        }

        // Update the user's verification status
        user.isVerified = true;
        await user.save();

        // Respond with the updated user information
        res.status(200).json({
            message: 'User verification status updated successfully',
            user: {
                id: user.id,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error('Error updating verification status:', error);
        res.status(500).json({ message: 'Error updating verification status', error });
    }
};


// Get Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const { email, companyName, companyAddress, companyLogo } = req.body;

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({ email, companyName, companyAddress, companyLogo });
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid old password' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedNewPassword });
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error changing password', error });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        // Optional: Log user info
        console.log('Authenticated user:', req.user);

        // Fetch all users
        const users = await User.findAll({
            attributes: { exclude: ['password'] }, // Exclude sensitive fields
        });

        res.status(200).json({
            message: 'Users fetched successfully',
            users,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Delete User (Soft Delete)
// Delete User (Soft or Hard Delete)
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find the user in the database
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Perform delete (use destroy for hard delete or set a flag for soft delete)
        await user.destroy();

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
};


// Sign-Out
exports.signOut = (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Token extraction (if needed)
    const token = authHeader.split(' ')[1];

    // Optionally, you can add token invalidation logic here (e.g., store it in a blacklist)

    res.status(200).json({ message: 'Sign out successful' });
};
