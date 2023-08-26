const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "formfirst",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the MySQL database!");
});
//POST
app.post("/api/submitForm", (req, res) => {
  const { firstName, lastName, email } = req.body;
  const sql =
    "INSERT INTO form_data (first_name, last_name, email) VALUES (?, ?, ?)";
  connection.query(sql, [firstName, lastName, email], (err, result) => {
    if (err) throw err;
    console.log("Form data inserted successfully!");
    res.sendStatus(200);
  });
});
//GET
app.get("/api/getFormData", (req, res) => {
  const sql = "SELECT id, first_name, last_name, email FROM form_data";
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching form data:", err);
      return res.status(500).json({ error: "Error fetching form data" });
    }
    console.log("Form data fetched successfully!");
    return res.status(200).json(result);
  });
});
// //DELETE
app.delete("/api/deleteFormData/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM form_data WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting form data:", err);
      return res.status(500).json({ error: "Error deleting form data" });
    }
    console.log("Form data deleted successfully!");
    return res.sendStatus(200);
  });
});
//UPDATE
app.put("/api/editFormData/:id", (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email } = req.body;
  console.log("Received Data for Update:", { id, firstName, lastName, email });
  const sql =
    "UPDATE form_data SET first_name = ?, last_name = ?, email = ? WHERE id = ?";

  connection.query(sql, [firstName, lastName, email, id], (err, result) => {
    if (err) {
      console.error("Error updating form data:", err);
      return res.status(500).json({ error: "Error updating form data" });
    }
    console.log("Form data updated successfully!");
    return res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
