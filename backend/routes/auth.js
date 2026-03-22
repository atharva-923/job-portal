const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const router   = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { accountType, email, password, phone,
                // job seeker fields
                fullName, username, gender,
                // company fields
                companyName, contactPerson, industry, companySize, website
              } = req.body;

        if (await User.findOne({ email }))
            return res.status(400).json({ message: 'Email already registered' });

        if (username && await User.findOne({ username }))
            return res.status(400).json({ message: 'Username already taken' });

        const hashed = await bcrypt.hash(password, 10);

        let userData = { email, password: hashed, phone, accountType: accountType || 'job_seeker' };

        if (accountType === 'company') {
            userData = { ...userData, companyName, contactPerson, industry, companySize, website,
                         fullName: companyName, role: 'user' };
        } else {
            userData = { ...userData, fullName, username, gender, role: 'user' };
        }

        const user = await User.create(userData);
        res.status(201).json({ message: 'Registered successfully', userId: user._id });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                fullName: user.fullName || user.companyName,
                email: user.email,
                role: user.role,
                accountType: user.accountType
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;