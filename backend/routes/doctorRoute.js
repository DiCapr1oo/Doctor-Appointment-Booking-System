import express from "express";
import {
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentsCancel,
  appointmentsCompleted,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  generateStats,
} from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";
import {
  getConversationsForDoctor,
  sendMessage,
  getMessages,
} from "../controllers/messageController.js";
import upload from "../middlewares/multer.js"; // Import multer

const doctorRouter = express.Router();

doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.post("/complete-appointment", authDoctor, appointmentsCompleted);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentsCancel);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);
doctorRouter.post("/generate-stats", authDoctor, generateStats);
doctorRouter.get("/conversations", authDoctor, getConversationsForDoctor);
doctorRouter.post(
  "/messages/send",
  authDoctor,
  upload.single("image"), // Thêm middleware multer
  sendMessage
);
doctorRouter.get("/messages/:conversationId", authDoctor, getMessages);

export default doctorRouter;
