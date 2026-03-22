const express  = require('express');
const User     = require('../models/User');
const { protect } = require('../middleware/auth');
const router   = express.Router();

// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/users/profile
router.patch('/profile', protect, async (req, res) => {
    try {
        const { fullName, username, phone, city, preferredRole,
                companyName, contactPerson, industry, companySize, website } = req.body;

        // Build update object with only provided fields
        const updates = {};
        if (fullName      !== undefined) updates.fullName      = fullName;
        if (username      !== undefined) updates.username      = username;
        if (phone         !== undefined) updates.phone         = phone;
        if (city          !== undefined) updates.city          = city;
        if (preferredRole !== undefined) updates.preferredRole = preferredRole;
        if (companyName   !== undefined) updates.companyName   = companyName;
        if (contactPerson !== undefined) updates.contactPerson = contactPerson;
        if (industry      !== undefined) updates.industry      = industry;
        if (companySize   !== undefined) updates.companySize   = companySize;
        if (website       !== undefined) updates.website       = website;

        // Check username not taken by someone else
        if (username) {
            const existing = await User.findOne({ username, _id: { $ne: req.user.id } });
            if (existing) return res.status(400).json({ message: 'Username already taken' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/users/company?name=CompanyName — public
router.get('/company', async (req, res) => {
    try {
        const name = req.query.name;
        if (!name) return res.status(400).json({ message: 'Name required' });
        const user = await User.findOne({
            $or: [{ fullName: name }, { companyName: name }],
            accountType: 'company'
        }).select('-password');
        if (!user) return res.status(404).json({ message: 'Company not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;