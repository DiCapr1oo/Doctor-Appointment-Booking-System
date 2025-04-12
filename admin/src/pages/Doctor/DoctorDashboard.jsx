import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets.js";
import { AppContext } from "../../context/AppContext.jsx";
import axios from "axios"; // Đã có axios để gọi API

const DoctorDashboard = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const {
    dToken,
    dashData,
    getDashData,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false); // Đã có state để hiển thị loading
  const [statsData, setStatsData] = useState(null); // Thêm state để lưu số liệu thống kê

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  // Hàm gọi endpoint PHP để tạo báo cáo
  const generateReport = async () => {
    if (!dashData) {
      alert("Không có dữ liệu để tạo báo cáo!");
      return;
    }

    setIsLoading(true);
    try {
      const reportData = {
        totalRevenue: dashData.earnings * 1000, // Nhân 1000 để khớp với giao diện
        appointmentCount: dashData.appointments,
        patientCount: dashData.patients,
        appointments: dashData.latestAppointments, // Gửi danh sách cuộc hẹn
      };

      const response = await axios.post(
        "http://localhost/php-services/generate-dashboard-report.php",
        reportData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { status, message, fileUrl } = response.data;

      if (status === "success") {
        // Tạo link tải PDF
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", "dashboard_report.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
        alert("Báo cáo đã được tạo và tải về!");
      } else {
        console.error("Lỗi:", message);
        alert("Lỗi khi tạo báo cáo: " + message);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API PHP:", error);
      alert("Lỗi khi tạo báo cáo: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm gọi API generateStats để thống kê số liệu
  const generateStats = async () => {
    if (!dashData) {
      alert("Không có dữ liệu để thống kê!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/doctor/generate-stats",
        { docId: dashData._id },
        { headers: { dToken } }
      );

      const { success, statsData, message } = response.data;

      if (success) {
        setStatsData(statsData);
        alert("Thống kê số liệu thành công!");
      } else {
        console.error("Lỗi:", message);
        alert("Lỗi khi thống kê: " + message);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      alert("Lỗi khi thống kê: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    dashData && (
      <div className="m-5">
        {/* Thêm nút Báo Cáo và Thống Kê Số Liệu ở đầu trang */}
        <div className="flex justify-end mb-5">
          <button
            onClick={generateReport}
            disabled={isLoading}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Đang tạo..." : "Báo Cáo"}
          </button>
          <button
            onClick={generateStats}
            disabled={isLoading}
            className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all ml-2 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Đang xử lý..." : "Thống Kê Số Liệu"}
          </button>
        </div>

        {/* Hiển thị số liệu thống kê nếu có */}
        {statsData && (
          <div className="bg-white p-4 rounded border-2 border-gray-100 mb-5">
            <h3 className="text-lg font-semibold mb-3">Thống Kê Số Liệu</h3>
            <p>
              <strong>Ngày Thống Kê:</strong> {statsData.reportDate}
            </p>
            <p>
              <strong>Tổng Doanh Thu:</strong>{" "}
              {statsData.totalRevenue.toLocaleString("vi-VN")} {currency}
            </p>
            <p>
              <strong>Tổng Số Bệnh Nhân:</strong> {statsData.totalPatients}
            </p>
            <p>
              <strong>Tổng Số Buổi Hẹn Đã Tiếp Nhận:</strong>{" "}
              {statsData.totalAppointments}
            </p>
            <p>
              <strong>Số Buổi Hẹn Bị Hủy:</strong>{" "}
              {statsData.cancelledAppointments}
            </p>
            <p>
              <strong>Số Buổi Hẹn Hoàn Thành:</strong>{" "}
              {statsData.completedAppointments}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {(dashData.earnings * 1000).toLocaleString("vi-VN")} {currency}
              </p>
              <p className="text-gray-400">Thu nhập</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.appointments_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Cuộc hẹn</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-gray-400">Bệnh nhân</p>
            </div>
          </div>
        </div>

        <div className="bg-white">
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded border">
            <img src={assets.list_icon} alt="" />
            <p className="font-semibold">Lượt đăng ký khám gần nhất</p>
          </div>

          <div className="pt-4 border border-t-0">
            {dashData.latestAppointments.map((item, index) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
                key={index}
              >
                <img
                  className="rounded-full w-10"
                  src={item.userData.image}
                  alt=""
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.userData.name}
                  </p>
                  <p className="text-gray-600">
                    {slotDateFormat(item.slotDate)}, {item.slotTime}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-500 text-xs font-medium">Đã Hủy</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">
                    Hoàn Thành
                  </p>
                ) : (
                  <div className="flex">
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-10 cursor-pointer"
                      src={assets.cancel_icon}
                      alt=""
                    />
                    <img
                      onClick={() => completeAppointment(item._id)}
                      className="w-10 cursor-pointer"
                      src={assets.tick_icon}
                      alt=""
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
