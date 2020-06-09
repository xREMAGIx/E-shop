const { protect, roleProtect } = require("../middlewares/auth");
const oders_ctr = require("../controllers/orders");

const express = require("express");
const router = express.Router();

router.get("/", protect, roleProtect("admin"), oders_ctr.getOders);
router.get("/:id", protect, roleProtect("admin"), oders_ctr.getOder);
router.post("/createOrder", protect, oders_ctr.Create0der);
module.exports = router;
