import React, { useState, useEffect } from "react";
import AddInternship from "./AddInternship.jsx";

function Home({ accessToken, loginStatus }) {
  const [tables, setTables] = useState([]);
  const [search, setSearch] = useState("");
  const [editingRow, setEditingRow] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);


  // Fetch table data
  const fetchTables = (query = "") => {
    fetch(`http://127.0.0.1:5000/api/tables?search=${query}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setTables(data);
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchTables(value);
  };

  // Edit popup
  const handleEditClick = (row) => {
    if (!row.application_id) {
      alert("Selected row has no ID!");
      return;
    }
    setEditingRow({ ...row });
    setShowEditPopup(true);
  };

  const handleCancel = () => {
    setEditingRow(null);
    setShowEditPopup(false);
  };

  const handleSave = async () => {
    if (!editingRow || !editingRow.application_id) {
      alert("Invalid row selected");
      return;
    }
    try {
      const res = await fetch("http://127.0.0.1:5000/api/update_row", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic_id: editingRow.topic_id,
          subject_id: editingRow.subject_id,
          internship_id: editingRow.internship_id,
          topic_name: editingRow.topic_name,
          subject_name: editingRow.subject_name,
          company_name: editingRow.company_name,
          internship_description: editingRow.internship_description,
        }),
      });

      const data = await res.json();
      if (data.status === "success") {
        console.log("Update successful:", data);
        setTables((prev) =>
          prev.map((row) =>
            row.application_id === editingRow.application_id
              ? { ...editingRow }
              : row
          )
        );
        setShowEditPopup(false);
      } else {
        console.error("Update failed:", data.message);
      }
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!id) {
      alert("Invalid row selected!");
      return;
    }

    console.log("Deleting application_id:", id);

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/delete_application/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        alert("Deleted successfully!");
        fetchTables(); // refresh data
      } else {
        alert("Failed to delete record!");
      }
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };
  


  return (
    <>
      <head>
        <title>Home</title>
      </head>

      <div className="page-appear">
        <h1>Welcome to Academic Curriculum Mapping</h1>
        <br />

        {loginStatus ? (
          <>
            <div style={{ display: "inline" }}>
              <p
                style={{
                  marginBottom: "20px",
                  marginLeft: "65px",
                  textAlign: "left",
                }}
              >
                Search:{" "}
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={handleSearch}
                  style={{ margin: "0px", padding: "5px", width: "20%" }}
                />
                {accessToken && (
                <button
                  style={{
                    marginLeft: "770px",
                    width: "60px",
                    height: "40px",
                  }}
                  className="button5"
                  onClick={() => setShowAddModal(true)}
                  title = "Add Internship"
                >
                  Add
                </button>)}
                {showAddModal && (
                  <AddInternship
                    onClose={() => {
                      setShowAddModal(false);
                      fetchTables(); // refresh table after adding
                    }}
                  />
                )}

              </p>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Enrollment No.</th>
                  <th>Student Name</th>
                  <th>Subject Name</th>
                  <th>Topic Name</th>
                  <th>Company Name</th>
                  <th>Internship Description</th>
                  {accessToken && <th>Edit</th>}
                  {accessToken && <th>Delete</th>}
                </tr>
              </thead>
              <tbody>
                {tables.map((item) => (
                  <tr key={item.application_id}>
                    <td>{item.enrollment_no}</td>
                    <td>{item.student_name}</td>
                    <td>{item.subject_name}</td>
                    <td>{item.topic_name}</td>
                    <td>{item.company_name}</td>
                    <td>{item.internship_description}</td>

                    {accessToken && (
                      <td>
                        <button
                          style={{ padding: "5px", fontSize: "20px" }}
                          className="button4"
                          onClick={() => handleEditClick(item)}
                          title="Edit"
                        >
                          ✒️
                        </button>
                      </td>
                    )}

                    {accessToken && (
                      <td>
                        <button
                          style={{ padding: "5px", fontSize: "20px" }}
                          className="button4"
                          onClick={() => handleDelete(item.application_id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <h1>Please Login First</h1>
        )}

        {showEditPopup && editingRow && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <form
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                minWidth: "300px",
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <h3>Edit Row</h3>

              <label>
                Topic Name:
                <input
                  type="text"
                  value={editingRow.topic_name}
                  onChange={(e) =>
                    setEditingRow({
                      ...editingRow,
                      topic_name: e.target.value,
                    })
                  }
                />
              </label>
              <br />

              <label>
                Subject Name:
                <input
                  type="text"
                  value={editingRow.subject_name}
                  onChange={(e) =>
                    setEditingRow({
                      ...editingRow,
                      subject_name: e.target.value,
                    })
                  }
                />
              </label>
              <br />

              <label>
                Company Name:
                <input
                  type="text"
                  value={editingRow.company_name}
                  onChange={(e) =>
                    setEditingRow({
                      ...editingRow,
                      company_name: e.target.value,
                    })
                  }
                />
              </label>
              <br />

              <label>
                Internship Description:
                <input
                  type="text"
                  style={{ width: "100%" }}
                  value={editingRow.internship_description}
                  onChange={(e) =>
                    setEditingRow({
                      ...editingRow,
                      internship_description: e.target.value,
                    })
                  }
                />
              </label>
              <br />

              <button type="submit">Save</button>
              <button
                type="button"
                onClick={handleCancel}
                style={{ marginLeft: "10px" }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
