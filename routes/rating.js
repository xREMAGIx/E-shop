const express = require("express");
const { createRating, createReply } = require("../controllers/rating");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.use(protect)
router.post("/", createRating);
router.post("/:id/replies", createReply);

module.exports = router;
