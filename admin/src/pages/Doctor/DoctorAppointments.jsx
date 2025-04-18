import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets.js";

const DoctorAppointments = () => {
  const {
    dToken,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);

  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);
  return (
    <div className="w-full max-w-7xl m-5">
      <p className="mb-3 text-lg font-medium">Danh Sách Cuộc Hẹn</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1.5fr_1.5fr_2.5fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p>#</p>
          <p>Bệnh nhân</p>
          <p>Tuổi</p>
          <p>Số điện thoại</p>
          <p>Thanh toán</p>
          <p>Thời gian</p>
          <p>Phí khám</p>
          <p className="text-center">Thao tác</p>
        </div>

        {appointments.reverse().map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1.5fr_1.5fr_2.5fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={item.userData.image}
                alt=""
              />
              <p>{item.userData.name}</p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p className="max-sm:hidden">{item.userData.phone}</p>

            <div>
              <p className="text-xs inline border border-primary px-2 rounded-full">
                {item.payment ? "Online" : "Tiền mặt"}
              </p>
            </div>
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>
            <p>
              {(item.amount * 1000).toLocaleString("vi-VN")}
              {currency}
            </p>
            {item.cancelled ? (
              <p className="text-red-500 text-xs font-medium text-center">
                Đã Hủy
              </p>
            ) : item.isCompleted ? (
              <p className="text-green-500 text-xs font-medium text-center">
                Hoàn Thành
              </p>
            ) : (
              <div className="flex justify-center">
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
  );
};

export default DoctorAppointments;
