import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import pool from "../config/mysqlConfig.js";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.json({ success: true, message: "Trạng Thái Đã Thay Đổi" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
    s;
  }
};

//API for doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({
        success: false,
        message: "Thông Tin Không Hợp Lệ",
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Thông Tin Không Hợp Lệ" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//API to mark Cuộc Hẹn Đã Hoàn Thành for doctor panel
const appointmentsCompleted = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Cuộc Hẹn Đã Hoàn Thành" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
///API to cancel appointment for doctor panel
const appointmentsCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Cuộc Hẹn Đã Bị Hủy" });
    } else {
      return res.json({ success: false, message: "Thao Tác Hủy Thất Bại" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });
    let patients = [];

    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select("-password");
    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//API to update doctor profile data from Doctor Panel
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;
    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

    res.json({ success: true, message: "Hồ Sơ Đã Được Cập Nhật" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API mới: generateStats (để thống kê số liệu và lưu vào MySQL)
const generateStats = async (req, res) => {
  try {
    const { docId } = req.body;

    // Lấy tất cả cuộc hẹn của bác sĩ
    const appointments = await appointmentModel.find({ docId });

    // Tính toán số liệu
    let totalRevenue = 0;
    let totalPatients = [];
    let totalAppointments = appointments.length;
    let cancelledAppointments = 0;
    let completedAppointments = 0;

    appointments.forEach((item) => {
      // Doanh thu: Chỉ tính các cuộc hẹn đã hoàn thành hoặc đã thanh toán
      if (item.isCompleted || item.payment) {
        totalRevenue += item.amount;
        completedAppointments += 1;
      }
      // Số buổi hẹn bị hủy
      if (item.cancelled) {
        cancelledAppointments += 1;
      }
      // Số bệnh nhân: Loại bỏ trùng lặp
      if (!totalPatients.includes(item.userId)) {
        totalPatients.push(item.userId);
      }
    });

    const statsData = {
      doctorId: docId,
      totalRevenue: totalRevenue * 1000, // Nhân 1000 như trong báo cáo PDF
      totalPatients: totalPatients.length,
      totalAppointments,
      cancelledAppointments,
      completedAppointments,
      reportDate: new Date().toISOString().split("T")[0], // Ngày hiện tại (YYYY-MM-DD)
    };

    // Lưu vào MySQL
    await pool.query(
      `INSERT INTO doctor_stats (doctor_id, total_revenue, total_patients, total_appointments, cancelled_appointments, completed_appointments, report_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        statsData.doctorId,
        statsData.totalRevenue,
        statsData.totalPatients,
        statsData.totalAppointments,
        statsData.cancelledAppointments,
        statsData.completedAppointments,
        statsData.reportDate,
      ]
    );

    res.json({ success: true, statsData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  appointmentsDoctor,
  appointmentsCancel,
  appointmentsCompleted,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  generateStats,
};
