import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  return (
    <div className="min-h-screen bg-white border-r">
      {aToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to={"/admin-dashboard"}
          >
            <img src={assets.home_icon} alt="" />
            <p className="hidden md:block">Trang Chủ</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to={"/all-appointment"}
          >
            <img src={assets.appointment_icon} alt="" />
            <p className="hidden md:block">Các Cuộc Hẹn</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to={"/add-doctor"}
          >
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block">Thêm Bác Sĩ</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to={"/doctor-list"}
          >
            <img src={assets.people_icon} alt="" />
            <p className="hidden md:block">Danh Sách Bác Sĩ</p>
          </NavLink>
        </ul>
      )}

      {dToken && (
        <ul className="text-[#515151] mt-5">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to={"/doctor-dashboard"}
          >
            <img src={assets.home_icon} alt="" />
            <p className="hidden md:block">Trang Chủ</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to={"/doctor-appointments"}
          >
            <img src={assets.appointment_icon} alt="" />
            <p className="hidden md:block">Các Cuộc Hẹn</p>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? "bg-[#F2F3FF] border-r-4 border-primary" : ""
              }`
            }
            to={"/doctor-profile"}
          >
            <img src={assets.people_icon} alt="" />
            <p className="hidden md:block">Hồ Sơ Cá Nhân</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
