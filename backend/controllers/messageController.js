import Message from "../models/messageModel.js";
import Appointment from "../models/appointmentModel.js";
import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";
import { v2 as cloudinary } from "cloudinary";

const getConversationsForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const appointments = await Appointment.find({ userId }).populate("docId");

    const conversationsMap = new Map();
    appointments.forEach((appointment) => {
      const conversationId = `${appointment.docId._id}_${userId}`;
      if (!conversationsMap.has(conversationId)) {
        conversationsMap.set(conversationId, {
          conversationId,
          name: appointment.docId.name,
          avatar: appointment.docId.image || "default-avatar.png",
          doctorId: appointment.docId._id,
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());
    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching conversations", error });
  }
};

const getConversationsForDoctor = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const appointments = await Appointment.find({ docId: doctorId }).populate(
      "userId"
    );

    const conversationsMap = new Map();
    appointments.forEach((appointment) => {
      const conversationId = `${doctorId}_${appointment.userId._id}`;
      if (!conversationsMap.has(conversationId)) {
        conversationsMap.set(conversationId, {
          conversationId,
          name: appointment.userId.name,
          avatar: appointment.userId.image || "default-avatar.png",
          userId: appointment.userId._id,
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());
    res.status(200).json({ success: true, data: conversations });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching conversations", error });
  }
};

const sendMessage = async (req, res) => {
  const {
    receiverId,
    content,
    conversationId,
    receiverModel,
    isImage = false,
  } = req.body;
  const imageFile = req.file;
  const senderId = req.user._id;
  const senderModel = req.senderModel;

  try {
    let messageContent;

    if (isImage) {
      // Nếu là tin nhắn ảnh, phải có file ảnh
      if (!imageFile) {
        return res
          .status(400)
          .json({ success: false, message: "Không có file ảnh được gửi" });
      }
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "chat_images",
      });
      messageContent = imageUpload.secure_url;
    } else {
      // Nếu là tin nhắn text, phải có content
      if (!content) {
        return res.status(400).json({
          success: false,
          message: "Nội dung tin nhắn không được để trống",
        });
      }
      messageContent = content;
    }

    const message = new Message({
      sender: senderId,
      senderModel,
      receiver: receiverId,
      receiverModel,
      content: messageContent,
      conversationId,
      isImage,
    });
    await message.save();
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error sending message", error });
  }
};

const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId });

    const populatedMessages = await Promise.all(
      messages.map(async (message) => {
        const populatedMessage = message.toObject();

        if (message.senderModel === "user") {
          const sender = await User.findById(message.sender);
          populatedMessage.sender = { _id: sender._id, name: sender.name };
        } else if (message.senderModel === "doctor") {
          const sender = await Doctor.findById(message.sender);
          populatedMessage.sender = { _id: sender._id, name: sender.name };
        }

        if (message.receiverModel === "user") {
          const receiver = await User.findById(message.receiver);
          populatedMessage.receiver = {
            _id: receiver._id,
            name: receiver.name,
          };
        } else if (message.receiverModel === "doctor") {
          const receiver = await Doctor.findById(message.receiver);
          populatedMessage.receiver = {
            _id: receiver._id,
            name: receiver.name,
          };
        }

        return populatedMessage;
      })
    );

    res.status(200).json({ success: true, data: populatedMessages });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching messages", error });
  }
};

export {
  getConversationsForUser,
  getConversationsForDoctor,
  sendMessage,
  getMessages,
};
