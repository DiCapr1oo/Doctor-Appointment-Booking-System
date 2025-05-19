import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// User authentication middleware
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // Lấy thông tin user từ database
    const user = await User.findById(token_decode.id);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    req.senderModel = "user";
    req.body.userId = token_decode.id;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
