import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  senderModel: {
    type: String,
    required: true,
    enum: ["user", "doctor"],
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ["user", "doctor"],
  },
  content: {
    type: String,
    required: true,
  },
  conversationId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isImage: {
    type: Boolean,
    default: false,
  },
});

const messageModel =
  mongoose.models.message || mongoose.model("message", messageSchema);

export default messageModel;
