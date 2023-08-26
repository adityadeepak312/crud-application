import React, { useState } from "react";

const EditForm = ({ data, onSave, onCancel }) => {
  const [firstName, setFirstName] = useState(data.first_name);
  const [lastName, setLastName] = useState(data.last_name);
  const [email, setEmail] = useState(data.email);

  const handleSubmit = (e) => {
    e.preventDefault();

    const editedData = { ...data, firstName, lastName, email };
    onSave(editedData);
  };

  return (
    <div className="EditForm">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="editFirstName">First Name:</label>
          <input
            type="text"
            id="editFirstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="editLastName">Last Name:</label>
          <input
            type="text"
            id="editLastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="editEmail">Email:</label>
          <input
            type="email"
            id="editEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditForm;
