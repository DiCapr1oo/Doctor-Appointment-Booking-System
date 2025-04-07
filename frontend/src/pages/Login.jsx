import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";

const Login = () => {
  const { backendUrl, token, setToken, setUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formType = searchParams.get("type") || "signup"; // Mặc định là signup

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (formType === "login") {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          password,
          email,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          setUserData(data.user); // Lưu thông tin user
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          password,
          email,
          dob,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          setUserData(data.user); // Lưu thông tin user
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {formType === "signup" ? "Tạo Tài Khoản" : "Đăng Nhập"}
        </p>
        <p>
          Hãy {formType === "signup" ? "tạo tài khoản" : "đăng nhập"} để đăng ký
          lịch hẹn.
        </p>

        {formType === "signup" && (
          <div className="w-full">
            <p>Họ & Tên</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-primary"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        {formType === "signup" && (
          <div className="w-full">
            <p>Ngày Sinh</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-primary"
              type="date"
              max={new Date().toISOString().split("T")[0]} // Quan trọng: giới hạn ngày tối đa
              onChange={(e) => setDob(e.target.value)}
              value={dob}
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-primary"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className="w-full">
          <p>Mật Khẩu</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-none focus:border-primary"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base mt-2 hover:bg-primary-dark transition-colors"
        >
          {formType === "signup" ? "Create Account" : "Login"}
        </button>

        {formType === "signup" ? (
          <p>
            Đã có tài khoản?{" "}
            <span
              onClick={() => navigate("/login?type=login")}
              className="text-primary underline cursor-pointer"
            >
              Đăng nhập tại đây
            </span>
          </p>
        ) : (
          <p>
            Chưa có tài khoản?{" "}
            <span
              onClick={() => navigate("/login?type=signup")}
              className="text-primary underline cursor-pointer"
            >
              Tạo tài khoản
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
