const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title:         { type: String, required: true },
    category:      { type: String, required: true },
    details:       { type: String, required: true },
    openPositions: { type: Number, default: 1 },
    image:         { type: String, default: '' },
    company:       { type: String, default: '' },
    location:      { type: String, default: '' },
    salary:        { type: String, default: '' },
    type:          { type: String, default: 'Full-time' },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);