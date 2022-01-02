const path = require("path");
const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(cors({origin: "http://localhost:3000"}));
app.use(express.json());

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/heartbeat", (req, res) => {
  // res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  res.status(200).send({message:"Backend is working."});
});

const adminRoutes = require("./routes/admin");

app.use(adminRoutes);

app.listen(PORT);
