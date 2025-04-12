import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";
import {
  getConversationsForUser,
  sendMessage,
  getMessages,
} from "../controllers/messageController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.get("/conversations", authUser, getConversationsForUser);
userRouter.post(
  "/messages/send",
  authUser,
  upload.single("image"), // Thêm middleware multer để xử lý file ảnh
  sendMessage
);
userRouter.get("/messages/:conversationId", authUser, getMessages);

export default userRouter;
