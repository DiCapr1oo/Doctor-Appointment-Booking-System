import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* -------------LEFT SECTION------------ */}
        <div>
          <img className="mb-5 w-40" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Chào mừng đến với Prescripto, đối tác đáng tin cậy của bạn trong
            việc quản lý nhu cầu chăm sóc sức khỏe của bạn một cách thuận tiện
            và hiệu quả. Tại Prescripto, chúng tôi hiểu những thách thức mà mọi
            người phải đối mặt khi lên lịch hẹn khám bác sĩ và quản lý hồ sơ sức
            khỏe của họ.
          </p>
        </div>

        {/* -------------CENTER SECTION------------ */}
        <div>
          <p className="text-xl font-medium mb-5">PRESCRIPTO</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Trang Chủ</li>
            <li>Về Chúng Tôi</li>
            <li>Liên Hệ</li>
            <li>Điều Khoản</li>
          </ul>
        </div>

        {/* -------------RIGHT SECTION------------ */}
        <div>
          <p className="text-xl font-medium mb-5">LIÊN HỆ</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+0-000-000-000</li>
            <li>contact@gmail.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
