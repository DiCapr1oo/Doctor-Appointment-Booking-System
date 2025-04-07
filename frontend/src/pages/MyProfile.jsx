import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/assets.js";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Profile Header */}
        <div className="flex items-start gap-6">
          {/* Profile Image  */}
          {isEdit ? (
            <label htmlFor="image" className="cursor-pointer">
              <div className="relative">
                <img
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="Profile"
                />
                <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full border border-gray-300">
                  <img
                    className="w-5 h-5"
                    src={assets.upload_icon}
                    alt="Upload"
                  />
                </div>
              </div>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
              />
            </label>
          ) : (
            <img
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              src={userData.image}
              alt="Profile"
            />
          )}

          {/* Name Field*/}
          <div className="flex-1 pt-2">
            {isEdit ? (
              <input
                className="w-full text-2xl font-semibold p-2 bg-gray-50 rounded border border-gray-200 focus:outline-none focus:border-primary"
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            ) : (
              <h2 className="text-2xl font-semibold text-gray-800">
                {userData.name}
              </h2>
            )}
          </div>
        </div>

        <hr className="my-6 border-gray-100" />

        {/* Contact Information  */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Thông Tin Liên Hệ
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Email</p>
              <p className="text-blue-600">{userData.email}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">
                Số điện thoại
              </p>
              {isEdit ? (
                <input
                  className="w-full p-2 bg-gray-50 rounded border border-gray-200 focus:outline-none focus:border-primary"
                  type="text"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              ) : (
                <p className="text-gray-700">{userData.phone}</p>
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Địa chỉ</p>
              {isEdit ? (
                <div className="space-y-2">
                  <input
                    className="w-full p-2 bg-gray-50 rounded border border-gray-200 focus:outline-none focus:border-primary"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={userData.address.line1}
                    type="text"
                  />
                  <input
                    className="w-full p-2 bg-gray-50 rounded border border-gray-200 focus:outline-none focus:border-primary"
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={userData.address.line2}
                    type="text"
                  />
                </div>
              ) : (
                <p className="text-gray-700">
                  {userData.address.line1}
                  <br />
                  {userData.address.line2}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information*/}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            Thông Tin Cơ Bản
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">
                Giới Tính
              </p>
              {isEdit ? (
                <select
                  className="w-full p-2 bg-gray-50 rounded border border-gray-200 focus:outline-none focus:border-primary"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  value={userData.gender}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p className="text-gray-700">{userData.gender}</p>
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">
                Ngày sinh
              </p>
              {isEdit ? (
                <input
                  className="w-full p-2 bg-gray-50 rounded border border-gray-200 focus:outline-none focus:border-primary"
                  type="date"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  value={userData.dob}
                />
              ) : (
                <p className="text-gray-700">{userData.dob}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons*/}
        <div className="flex justify-end pt-4">
          {isEdit ? (
            <button
              className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
              onClick={updateUserProfileData}
            >
              Lưu Thông Tin
            </button>
          ) : (
            <button
              className="px-6 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-colors"
              onClick={() => setIsEdit(true)}
            >
              Sửa Thông Tin
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;
