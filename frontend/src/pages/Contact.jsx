import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          Liên Hệ{" "}
          <span className="text-gray-700 font-semibold">Prescripto</span>
        </p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt=""
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg text-gray-600">VĂN PHÒNG</p>
          <p className="text-gray-500">
            Tòa nhà ABC <br /> Số XYZ, Đường Cầu Giấy, Phường Dịch Vọng, TP Hà
            Nội
          </p>
          <p className="text-gray-500">
            Số điện thoại: (000) 000-0000 <br /> Email:
            d1capriooo-eaut@gmail.com
          </p>
          <p className="font-semibold text-lg text-gray-600">
            ĐĂNG KÝ LÀM BÁC SĨ
          </p>
          <p className="text-gray-500">
            Tìm hiểu thêm về các nhóm và việc làm của chúng tôi.
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white translate-all duration-300">
            Khám Phá Việc Làm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
