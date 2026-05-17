const express = require("express");
const exampleController = require("./exampleController")
const router = express.Router();

router.get("/get", exampleController.getExample);
router.post("/post", exampleController.postExample);

module.exports = router;

