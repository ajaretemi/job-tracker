import { useEffect, useState } from "react";
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "./services/jobService";
import "./App.css";

function App() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState(getEmptyForm());
  const [selectedJob, setSelectedJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  function getEmptyForm() {
    return {
      title: "",
      company: "",
      location: "",
      link: "",
      status: "Applied",
      notes: "",
      dateApplied: "",
      resume: null,
      coverLetter: null,
    };
  }

  useEffect(() => {
    getJobs()
      .then((res) => {
        console.log("Fetched jobs:", res.data); // Add this to debug
        setJobs(res.data);
      })
      .catch((err) => console.error("Error fetching jobs:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume" || name === "coverLetter") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, value);
      });

      if (isEditing && selectedJob) {
        const res = await updateJob(selectedJob._id, data);
        setJobs(
          jobs.map((job) => (job._id === selectedJob._id ? res.data : job))
        );
        setIsEditing(false);
        setSelectedJob(null);
      } else {
        const res = await createJob(data);
        setJobs([res.data, ...jobs]);
      }
      setFormData(getEmptyForm());
    } catch (err) {
      console.error("❌ Error submitting job:", err);
    }
  };

  const startEdit = () => {
    setFormData({ ...selectedJob, resume: null, coverLetter: null });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setSelectedJob(null);
    setFormData(getEmptyForm());
  };

  const handleDelete = async () => {
    if (!selectedJob) return;
    const confirm = window.confirm(
      `Are you sure you want to delete "${selectedJob.title}"?`
    );
    if (!confirm) return;

    try {
      await deleteJob(selectedJob._id);
      setJobs(jobs.filter((job) => job._id !== selectedJob._id));
      setSelectedJob(null);
    } catch (err) {
      console.error("❌ Failed to delete job:", err);
    }
  };

  return (
    <div className="container">
      <h1>Job Tracker</h1>

      <form
        onSubmit={handleSubmit}
        className="form"
        encType="multipart/form-data"
      >
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
        />
        <input
          name="link"
          type="url"
          placeholder="Link"
          value={formData.link}
          onChange={handleChange}
        />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          name="dateApplied"
          type="date"
          value={formData.dateApplied?.slice(0, 10)}
          onChange={handleChange}
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          style={{ gridColumn: "1 / -1", minHeight: "100px" }}
        />
        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <label>
            <span style={{ marginRight: "10px" }}>Resume:</span>
            <input
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
            />
          </label>
          <label>
            <span style={{ marginRight: "10px" }}>Cover Letter:</span>
            <input
              name="coverLetter"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">{isEditing ? "Update Job" : "Add Job"}</button>
        {isEditing && (
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <ul className="job-list">
        {jobs.map((job) => (
          <li
            key={job._id}
            onClick={() => setSelectedJob(job)}
            className="job-item"
          >
            <strong>{job.title}</strong> at {job.company} —{" "}
            <em>{job.status}</em>
          </li>
        ))}
      </ul>

      {selectedJob && !isEditing && (
        <div className="job-details">
          <h2>{selectedJob.title}</h2>
          <p>
            <strong>Company:</strong> {selectedJob.company}
          </p>
          <p>
            <strong>Location:</strong> {selectedJob.location || "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {selectedJob.status}
          </p>
          <p>
            <strong>Link:</strong>{" "}
            <a href={selectedJob.link} target="_blank" rel="noreferrer">
              {selectedJob.link}
            </a>
          </p>
          <p>
            <strong>Date Applied:</strong>{" "}
            {selectedJob.dateApplied?.slice(0, 10)}
          </p>
          <p>
            <strong>Notes:</strong> {selectedJob.notes}
          </p>
          {selectedJob.resume && (
            <p>
              <strong>Resume:</strong>{" "}
              <a href={selectedJob.resume} target="_blank" rel="noreferrer">
                View Resume
              </a>
            </p>
          )}
          {selectedJob.coverLetter && (
            <p>
              <strong>Cover Letter:</strong>{" "}
              <a
                href={selectedJob.coverLetter}
                target="_blank"
                rel="noreferrer"
              >
                View Cover Letter
              </a>
            </p>
          )}

          <button onClick={startEdit} style={{ marginRight: "10px" }}>
            Edit
          </button>
          <button
            onClick={() => setSelectedJob(null)}
            style={{ marginRight: "10px" }}
          >
            Close
          </button>
          <button
            onClick={handleDelete}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
