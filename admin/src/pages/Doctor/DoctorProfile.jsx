import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(DoctorContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available,
      };

      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        updateData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-6 m-5">
      {/* Profile Image */}
      <div className="sm:w-1/3">
        <img
          className="bg-primary/80 w-full h-auto max-w-xs rounded-lg shadow-md object-cover aspect-square"
          src={profileData.image || "/doctor-placeholder.jpg"}
          alt={`${profileData.name}'s profile`}
        />
      </div>

      {/* Profile Info */}
      <div className="flex-1 border border-stone-100 rounded-lg p-6 shadow-sm bg-white">
        {/* Doctor Info */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {profileData.name}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-gray-600">
              {profileData.degree} - {profileData.speciality}
            </p>
            <span className="py-1 px-2.5 border border-gray-200 text-xs rounded-full bg-gray-50 text-gray-700">
              {profileData.experience}
            </span>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">About</h2>
          <p className="text-gray-600 leading-relaxed">{profileData.about}</p>
        </div>

        {/* Fees & Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Phí khám</h3>
            <div className="text-xl font-semibold text-gray-800">
              {isEdit ? (
                <input
                  className="ml-2 p-1 border rounded w-24"
                  type="number"
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      fees: e.target.value,
                    }))
                  }
                  value={profileData.fees}
                />
              ) : (
                profileData.fees
              )}
              {currency}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Địa chỉ</h3>
            <div className="text-gray-800">
              {isEdit ? (
                <>
                  <input
                    className="w-full p-1 border rounded mb-1"
                    value={profileData.address.line1}
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                  />
                  <input
                    className="w-full p-1 border rounded"
                    value={profileData.address.line2}
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                  />
                </>
              ) : (
                <>
                  {profileData.address.line1}
                  <br />
                  {profileData.address.line2}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3 mb-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              onChange={() =>
                isEdit &&
                setProfileData((prev) => ({
                  ...prev,
                  available: !prev.available,
                }))
              }
              type="checkbox"
              className="sr-only peer"
              checked={profileData.available}
              disabled={!isEdit}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              Trạng thái nhận cuộc hẹn
            </span>
          </label>
        </div>

        {/* Edit/Save Button */}
        {isEdit ? (
          <button
            onClick={updateProfile}
            className="px-6 py-2 bg-primary text-white text-sm rounded-full mt-5 hover:bg-primary-dark transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            Lưu Thay Đổi
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="px-6 py-2 border border-primary text-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >
            Chỉnh Sửa Hồ Sơ
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
