const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Common fields
    fullName:      { type: String },
    username:      { type: String, unique: true, sparse: true },
    email:         { type: String, required: true, unique: true },
    password:      { type: String, required: true },
    phone:         { type: String },
    gender:        { type: String },
    city:          { type: String, default: 'Mumbai' },
    role:          { type: String, default: 'user' }, // 'user', 'admin', 'company'
    preferredRole: { type: String, default: 'Software Engineer' },
    accountType:   { type: String, default: 'job_seeker' }, // 'job_seeker' or 'company'

    // Company-specific fields
    companyName:    { type: String },
    contactPerson:  { type: String },
    industry:       { type: String },
    companySize:    { type: String },
    website:        { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);