// ── Seed file: run with `node seed.js` from backend folder ──
// Saves all hardcoded jobs to MongoDB if they don't exist yet

require('dotenv').config();
const mongoose = require('mongoose');
const Job      = require('./models/Job');
const connectDB = require('./config/db');

const hardcodedJobs = [
  { title:"Software Engineer",   category:"Tech",       details:"Responsible for designing, developing and maintaining software systems and applications.", openPositions:2, company:"TechCorp India",       location:"Mumbai, Maharashtra",    salary:"₹8L–₹15L/yr",  type:"Full-time" },
  { title:"Software Engineer",   category:"Tech",       details:"Responsible for designing, developing and maintaining software systems and applications.", openPositions:2, company:"CloudNine Systems",      location:"Pune, Maharashtra",      salary:"₹10L–₹18L/yr", type:"Full-time" },
  { title:"Data Scientist",      category:"Data",       details:"Responsible for collecting, analyzing and interpreting large data sets to help organizations make better decisions.", openPositions:3, company:"DataMinds Pvt. Ltd.",    location:"Pune, Maharashtra",      salary:"₹10L–₹20L/yr", type:"Full-time" },
  { title:"Data Scientist",      category:"Data",       details:"Responsible for collecting, analyzing and interpreting large data sets to help organizations make better decisions.", openPositions:2, company:"AIVerse Technologies",   location:"Bangalore, Karnataka",   salary:"₹15L–₹28L/yr", type:"Full-time" },
  { title:"Project Manager",     category:"Management", details:"Responsible for planning, executing and closing projects on time and within budget.", openPositions:1, company:"BuildRight Solutions",   location:"Bangalore, Karnataka",   salary:"₹12L–₹18L/yr", type:"Full-time" },
  { title:"Product Manager",     category:"Management", details:"Responsible for managing the entire product life cycle from ideation to launch.", openPositions:1, company:"InnovateLabs",          location:"Hyderabad, Telangana",   salary:"₹14L–₹22L/yr", type:"Full-time" },
  { title:"Sales Representative",category:"Sales",      details:"Responsible for reaching out to potential customers and closing sales deals.", openPositions:4, company:"GrowthEdge Inc.",        location:"Delhi, NCR",             salary:"₹4L–₹8L/yr",   type:"Full-time" },
  { title:"Sales Representative",category:"Sales",      details:"Responsible for reaching out to potential customers and closing sales deals.", openPositions:3, company:"NexGen Ventures",        location:"Chennai, Tamil Nadu",    salary:"₹5L–₹10L/yr",  type:"Full-time" },
  { title:"Marketing Manager",   category:"Marketing",  details:"Responsible for creating and executing marketing strategies to grow brand presence.", openPositions:1, company:"BrandBoost Agency",      location:"Mumbai, Maharashtra",    salary:"₹8L–₹14L/yr",  type:"Full-time" },
  { title:"Marketing Manager",   category:"Marketing",  details:"Responsible for creating and executing marketing strategies to grow brand presence.", openPositions:2, company:"ContentHive Media",      location:"Remote",                 salary:"₹4L–₹8L/yr",   type:"Remote"    },
  { title:"UI/UX Designer",      category:"Design",     details:"Responsible for designing intuitive user interfaces and smooth user experiences for web and mobile apps.", openPositions:2, company:"PixelCraft Studios",     location:"Bangalore, Karnataka",   salary:"₹6L–₹12L/yr",  type:"Full-time" },
  { title:"DevOps Engineer",     category:"Tech",       details:"Responsible for managing CI/CD pipelines, cloud infrastructure and ensuring system reliability.", openPositions:2, company:"CloudNine Systems",      location:"Pune, Maharashtra",      salary:"₹10L–₹18L/yr", type:"Full-time" },
  { title:"DevOps Engineer",     category:"Tech",       details:"Responsible for managing CI/CD pipelines, cloud infrastructure and ensuring system reliability.", openPositions:1, company:"TechCorp India",         location:"Mumbai, Maharashtra",    salary:"₹12L–₹20L/yr", type:"Full-time" },
  { title:"Financial Analyst",   category:"Finance",    details:"Responsible for analyzing financial data, preparing reports and providing investment insights.", openPositions:2, company:"WealthTree Advisors",    location:"Mumbai, Maharashtra",    salary:"₹7L–₹13L/yr",  type:"Full-time" },
  { title:"Machine Learning Engineer", category:"Data", details:"Responsible for building and deploying machine learning models to solve complex business problems.", openPositions:2, company:"AIVerse Technologies",   location:"Bangalore, Karnataka",   salary:"₹15L–₹28L/yr", type:"Full-time" },
  { title:"Machine Learning Engineer", category:"Data", details:"Responsible for building and deploying machine learning models to solve complex business problems.", openPositions:1, company:"DataMinds Pvt. Ltd.",    location:"Pune, Maharashtra",      salary:"₹12L–₹22L/yr", type:"Full-time" },
  { title:"Business Development Executive", category:"Sales", details:"Responsible for identifying new business opportunities, building client relationships and driving revenue growth.", openPositions:3, company:"NexGen Ventures",   location:"Chennai, Tamil Nadu",    salary:"₹5L–₹10L/yr",  type:"Full-time" },
  { title:"Business Development Executive", category:"Sales", details:"Responsible for identifying new business opportunities, building client relationships and driving revenue growth.", openPositions:2, company:"GrowthEdge Inc.",   location:"Delhi, NCR",             salary:"₹6L–₹12L/yr",  type:"Full-time" },
  { title:"Content Strategist",  category:"Marketing",  details:"Responsible for planning, creating and distributing content across digital platforms to drive engagement.", openPositions:2, company:"ContentHive Media",      location:"Remote",                 salary:"₹4L–₹8L/yr",   type:"Remote"    },
  { title:"Content Strategist",  category:"Marketing",  details:"Responsible for planning, creating and distributing content across digital platforms to drive engagement.", openPositions:1, company:"BrandBoost Agency",      location:"Mumbai, Maharashtra",    salary:"₹6L–₹10L/yr",  type:"Full-time" },
];

async function seed() {
  await connectDB();
  console.log('Connected to MongoDB');

  let added = 0;
  let skipped = 0;

  for (const job of hardcodedJobs) {
    const exists = await Job.findOne({ title: job.title, company: job.company });
    if (!exists) {
      await Job.create(job);
      added++;
      console.log(`✅ Added: ${job.title} @ ${job.company}`);
    } else {
      skipped++;
      console.log(`⏭  Skipped (already exists): ${job.title} @ ${job.company}`);
    }
  }

  console.log(`\nDone! ${added} jobs added, ${skipped} skipped.`);
  mongoose.connection.close();
}

seed().catch(err => {
  console.error('Seed error:', err.message);
  mongoose.connection.close();
});