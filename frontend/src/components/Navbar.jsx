import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData, setUserData } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken(null);
    setUserData(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">Trang Chủ</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">Đội Ngũ Bác Sĩ</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">Về Chúng Tôi</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">Liên Hệ</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-2">
            {/* Icon Tin nhắn */}
            <NavLink to="/messages" className="relative mr-5">
              <img src={assets.chat_icon} alt="" />{" "}
            </NavLink>
            {/* Avatar container với dropdown */}
            <div className="flex items-center gap-2 cursor-pointer group relative">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                <img
                  className="w-full h-full object-cover"
                  src={userData.image}
                  alt="User avatar"
                />
              </div>
              <img className="w-2.5" src={assets.dropdown_icon} alt="" />
              <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                  <p
                    onClick={() => navigate("my-profile")}
                    className="hover:text-black cursor-pointer"
                  >
                    Hồ Sơ Cá Nhân
                  </p>
                  <p
                    onClick={() => navigate("my-appointments")}
                    className="hover:text-black cursor-pointer"
                  >
                    Cuộc Hẹn Của Tôi
                  </p>
                  <p
                    onClick={logout}
                    className="hover:text-black cursor-pointer"
                  >
                    Đăng Xuất
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/login?type=login")}
              className="border border-primary text-primary px-6 py-2 rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => navigate("/login?type=signup")}
              className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-primary-dark transition-colors"
            >
              Tạo Tài Khoản
            </button>
          </div>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />
        {/* Mobile Menu */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">Trang Chủ</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded inline-block">Đội Ngũ Bác Sĩ</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">Về Chúng Tôi</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">Liên Hệ</p>
            </NavLink>
            {/* Thêm mục Tin nhắn vào menu mobile */}
            {token && userData && (
              <NavLink onClick={() => setShowMenu(false)} to="/messages">
                <p className="px-4 py-2 rounded inline-block">Tin nhắn</p>
              </NavLink>
            )}
            <div className="flex flex-col gap-2 w-full mt-4">
              <button
                onClick={() => {
                  navigate("/login?type=login");
                  setShowMenu(false);
                }}
                className="w-full border border-primary text-primary px-4 py-2 rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
              >
                Đăng Nhập
              </button>
              <button
                onClick={() => {
                  navigate("/login?type=signup");
                  setShowMenu(false);
                }}
                className="w-full bg-primary text-white px-4 py-2 rounded-full font-medium hover:bg-primary-dark transition-colors"
              >
                Tạo Tài Khoản
              </button>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
