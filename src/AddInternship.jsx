import React, { useState, useEffect } from "react";

function AddInternship({ onClose }) {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");

  // Fetch students & subjects
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));

    fetch("http://127.0.0.1:5000/api/subjects")
      .then((res) => res.json())
      .then((data) => setSubjects(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch topics when subject changes
  useEffect(() => {
    if (selectedSubject) {
      fetch(`http://127.0.0.1:5000/api/topics/${selectedSubject}`)
        .then((res) => res.json())
        .then((data) => setTopics(data))
        .catch((err) => console.error(err));
    } else {
      setTopics([]);
    }
  }, [selectedSubject]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      student_id: selectedStudent,
      subject_id: selectedSubject,
      topic_id: selectedTopic,
      company_name: company,
      internship_description: description,
    };

    const res = await fetch("http://127.0.0.1:5000/api/add_internship", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.status === "success") {
      alert("✅ Internship added successfully!");
      onClose();
    } else {
      alert("❌ Failed: " + result.message);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
            background: "white",
            padding: 20,
            borderRadius: 10,
            width: "300px",
            alignItems: "center"
        }}
      >
        <h3>Add Internship</h3>
        <label>Student : </label>
        <select 
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          required
          style={{width:'110px'}}
        >
          <option value="">Select student</option>
          {students.map((s) => (
            <option key={s.student_id} value={s.student_id}>
              {s.student_name}
            </option>
          ))}
        </select>
        <br /><br />

        <label>Subject : </label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          required
          style={{width:'110px'}}
        >
          <option value="">Select subject</option>
          {subjects.map((s) => (
            <option key={s.subject_id} value={s.subject_id}>
              {s.subject_name}
            </option>
          ))}
        </select>
        <br /><br />

        <label>Topic : </label>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          required
          style={{width:'110px'}}
        >
          <option value="">Select topic</option>
          {topics.map((t) => (
            <option key={t.topic_id} value={t.topic_id}>
              {t.topic_name}
            </option>
          ))}
        </select>
        <br /><br />

        <label>Company Name:</label>
        <input
          type="text"
          style={{width:'100%'}}
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <br /><br />

        <label style={{ display: "block", marginBottom: "5px" }}>Description:</label>
        <textarea
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ width: "100%" }}
        ></textarea>
        <br /><br />

        <button type="submit">Save</button>
        <button type="button" style={{ marginLeft: "10px" }} onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddInternship;
