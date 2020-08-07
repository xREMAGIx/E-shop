const { protect, roleProtect } = require("../middlewares/auth");
const oders_ctr = require("../controllers/orders");

const express = require("express");
const router = express.Router();

router.get("/", protect, roleProtect("admin"), oders_ctr.getOders);
router.get("/:id", protect, oders_ctr.getOder);

router
  .route("/:id")
  .delete(protect, roleProtect("admin"), oders_ctr.deleteOrder);

router.post("/createOrder", protect, oders_ctr.Create0der);

router.route("/:id").post(protect, roleProtect("admin"), oders_ctr.updateOrder);

router.get("/getUserOrder/:userId", protect, oders_ctr.getUserOrders);

module.exports = router;
