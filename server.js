import express from "express";
import mysql from "mysql";
import cors from "cors";
import bodyParser from "body-parser";
const PORT = 5000 || process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

// -------------------------------------------------Database Connection -------------------------------------------------

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user",
  port: 3308,
});

// -------------------------------------------------Root Path -----------------------------------------------------------

app.get("/", (req, res) => {
  return res.json("Welcome to Server");
});

// ------------------------------------------Sign in User By Username, Email, Password ----------------------------------

const signInUser = (req, res) => {
  const { username, email, password } = req.body;
  db.query(
    "INSERT INTO userinfo (username, email, password) VALUES (?, ?, ?)",
    [username, email, password],
    (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Server Error" });
      } else {
        return res.json({
          message: "User registered successfully.",
          data: data,
        });
      }
    }
  );
};

app.post("/sign-up", signInUser);

// ------------------------------------------login User By Username or Email, Password -------------------------------

const loginUser = (req, res) => {
  const { username, email, password } = req.body;
  db.query(
    "SELECT * FROM userinfo WHERE (username=? OR email=?) AND password=?",
    [username, email, password],
    (err, data, fields) => {
      if (err) {
        return res.status(500).json({ error: "Server Error" });
      } else {
        if (data.length > 0) {
          return res.json({ message: "Login successful.", data: data[0] });
        } else {
          return res.status(401).json({ error: "feild login" });
        }
      }
    }
  );
};

app.post("/login", loginUser);

// ---------------------------------------------------------Get All User Info----------------------------------
const getAlluser = (req, res) => {
  const sql = `SELECT * FROM userinfo`;
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Server Error" });
    }
    return res.json(data);
  });
};

app.get("/users", getAlluser);


// ---------------------------------------------------------Get User Info By ID ----------------------------------

const getUserById = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM userinfo WHERE id=${id}`;
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Server Error" });
    }
    return res.json(data);
  });
};

app.get("/user/:id", getUserById);


// ---------------------------------------------------------Delete User By ID ----------------------------------

const removeUserById = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM userinfo WHERE id=${id}`;
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Server Error" });
    }
    return res.json({ message: "User successfully Deleted.", data: data });
  });
};

app.delete("/user/:id", removeUserById);

// ---------------------------------------------------------Update User Info By ID ----------------------------------

const updateUserById = (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  const sql = "UPDATE userinfo SET username=?, email=?, password=? WHERE id=?";
  db.query(sql, [username, email, password, id], (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Server Error" });
    }
    return res.json({ message: "User successfully Updated.", data: data });
  });
};

app.put("/user/:id", updateUserById);

// ---------------------------------------------------------Listening PORT ----------------------------------

app.listen(PORT, () => {
  console.log(`Server is Running ${PORT} port`);
});
