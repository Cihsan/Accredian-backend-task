import express from "express";
import mysql from "mysql";
import cors from "cors";

const PORT = 5000 || process.env.PORT;
const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "user",
  port: 3308,
});

app.get("/", (req, res) => {
  return res.json("Welcome to Server");
});

// ---------------------------------------------------------Get All User Info---------------------------------- 
app.get("/users", (req, res) => {
  const sql = `SELECT * FROM userinfo`;
  db.query(sql, (err, data) => {
    if (err) {
      console.log(res.json(err));
    }
    return res.json(data);
  });
});


app.post("/sign-up", async(req, res) => {
  const userinfo = req.body;
  console.log(userinfo)
});




app.listen(PORT, () => {
  console.log(`Server is Running ${PORT} port`);
});
