const { Router } = require("express");
//const { auth } = require("../firebase/firebase");

const router = new Router();

router.post("/admin/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === "test@gmail.com" && password === "test123") {
      res.status(200).send({ token: "123456" });
    } else {
      res.status(401).send();
    }
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/admin/verify", (req, res) => {
  try {
    const { token } = req.body;
    if (token === "123456") {
      res.status(200).send();
    } else {
      res.status(401).send();
    }
  } catch (error) {
    res.status(500).send();
  }
  res.status(200).send("OK");
});

module.exports = router;
