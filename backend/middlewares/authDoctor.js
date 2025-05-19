import jwt from "jsonwebtoken";
import Doctor from "../models/doctorModel.js";

// Doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;
    if (!dtoken) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);

    // Lấy thông tin doctor từ database
    const doctor = await Doctor.findById(token_decode.id);
    if (!doctor) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }

    req.user = doctor;
    req.senderModel = "doctor";
    req.body.docId = token_decode.id;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;
