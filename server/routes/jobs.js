// routes/jobs.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Job from '../models/Job.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Set up disk storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post(
  '/',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const {
        title,
        company,
        location,
        link,
        status,
        notes,
        dateApplied,
      } = req.body;

      const resumeFile = req.files?.resume?.[0];
      const coverLetterFile = req.files?.coverLetter?.[0];

      const job = new Job({
        title,
        company,
        location,
        link,
        status,
        notes,
        dateApplied,
        resume: resumeFile ? `/uploads/${resumeFile.filename}` : null,
        coverLetter: coverLetterFile ? `/uploads/${coverLetterFile.filename}` : null,
      });

      await job.save();
      res.status(201).json(job);
    } catch (err) {
      console.error("❌ Error creating job:", err);
      res.status(500).json({ error: "Failed to create job" });
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ dateApplied: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("❌ Error fetching jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

export const jobRoutes = router;
