import express from "express";
import {
  capturePayment,
  createPayment,
} from "../controllers/paypalController.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.post("/create-payment", authUser, createPayment);
router.post("/capture-payment", authUser, capturePayment);

export default router;
