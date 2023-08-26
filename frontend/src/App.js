import React, { useState, useEffect } from "react";
import EditForm from "./EditForm";

import "./App.css";
const App = () => {
  const [formData, setFormData] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchFormData = () => {
    fetch("http://localhost:5000/api/getFormData")
      .then((response) => response.json())
      .then((data) => {
        setFormData(data);
      });
  };

  useEffect(() => {
    fetchFormData();
  }, []);

  const submit = () => {
    alert("Data Submitted successfully");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/submitForm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Form data sent to the server:", data);

        setFirstName("");
        setLastName("");
        setEmail("");

        fetchFormData();
      })
      .catch((error) => {
        console.error("Error sending form data:", error);
      });
  };

  const handleDelete = (data) => {
    const formDataCopy = [...formData];
    const index = formDataCopy.findIndex((item) => item.id === data.id);
    if (index !== -1) {
      formDataCopy.splice(index, 1);
      setFormData(formDataCopy);

      fetch(`http://localhost:5000/api/deleteFormData/${data.id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            console.log("Form data deleted successfully!");
          } else {
            console.error("Error deleting form data:", response);

            setFormData([...formDataCopy]);
          }
        })
        .catch((error) => {
          console.error("Error deleting form data:", error);

          setFormData([...formDataCopy]);
        });
    }
  };

  const handleEdit = (data) => {
    setEditData(data);
    setEditing(true);
  };

  const handleSave = (editedData) => {
    console.log("Edited Data:", editedData);
    fetch(`http://localhost:5000/api/editFormData/${editedData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Form data updated successfully!");

          const updatedFormData = formData.map((data) =>
            data.id === editedData.id ? editedData : data
          );
          setFormData(updatedFormData);
        } else {
          console.error("Error updating form data:", response);
        }
      })
      .catch((error) => {
        console.error("Error updating form data:", error);
      })
      .finally(() => {
        setEditing(false);
      });
  };

  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <div className="Form">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            required
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            required
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button onClick={submit} type="submit">
          Submit
        </button>
      </form>
      {editing && editData && (
        <EditForm data={editData} onSave={handleSave} onCancel={handleCancel} />
      )}
      <div className="TableContainer">
        <h2>Submitted Data:</h2>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {formData?.map((data) => (
              <tr key={data.id}>
                <td>{data.id}</td>
                <td>{data.first_name}</td>
                <td>{data.last_name}</td>
                <td>{data.email}</td>
                <td>
                  <button onClick={() => handleEdit(data)}>Edit</button>
                  <button onClick={() => handleDelete(data)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
