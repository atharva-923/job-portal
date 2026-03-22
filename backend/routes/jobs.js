const express            = require('express');
const Job                = require('../models/Job');
const User               = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const router             = express.Router();

// GET /api/jobs — public
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/jobs — admin OR company account
router.post('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin' && user.accountType !== 'company') {
            return res.status(403).json({ message: 'Admin or Company access only' });
        }
        const job = await Job.create(req.body);
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/jobs/:id — admin OR company (own jobs only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'admin' && user.accountType !== 'company') {
            return res.status(403).json({ message: 'Admin or Company access only' });
        }
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;