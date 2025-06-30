// models/Job.js

import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  link: String,
  status: String,
  notes: String,
  dateApplied: Date,
  resume: String,        // file path
  coverLetter: String,   // file path
});


export default mongoose.model('Job', jobSchema);

