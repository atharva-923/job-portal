const express      = require('express');
const Application  = require('../models/Application');
const Job          = require('../models/Job');
const User         = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const router       = express.Router();

// POST /api/applications — logged in user applies
router.post('/', protect, async (req, res) => {
    try {
        const { jobId } = req.body;
        const exists = await Application.findOne({ userId: req.user.id, jobId });
        if (exists) return res.status(400).json({ message: 'Already applied to this job' });
        const app = await Application.create({ userId: req.user.id, jobId });
        res.status(201).json(app);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/applications/mine — user sees their own applications
router.get('/mine', protect, async (req, res) => {
    try {
        const apps = await Application.find({ userId: req.user.id })
            .populate('jobId', 'title category company');
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/applications/company — company sees applications for their jobs
router.get('/company', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.accountType !== 'company' && user.role !== 'admin') {
            return res.status(403).json({ message: 'Company access only' });
        }
        const companyName = user.fullName || user.companyName;

        // Get all jobs posted by this company
        const jobs = await Job.find({ company: companyName });
        const jobIds = jobs.map(j => j._id);

        // Get all applications for those jobs
        const apps = await Application.find({ jobId: { $in: jobIds } })
            .populate('userId', 'fullName email phone username')
            .populate('jobId', 'title company location salary');

        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/applications — admin sees all
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const apps = await Application.find()
            .populate('userId', 'fullName email')
            .populate('jobId', 'title company');
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/applications/:id — company or admin updates status
router.patch('/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.accountType !== 'company' && user.role !== 'admin') {
            return res.status(403).json({ message: 'Company or admin access only' });
        }
        const { status } = req.body;
        if (!['pending','reviewed','accepted','rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const app = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('userId', 'fullName email')
         .populate('jobId', 'title');
        res.json(app);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;