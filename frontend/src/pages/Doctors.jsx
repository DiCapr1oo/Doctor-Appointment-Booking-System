import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(true);
  const [sortByExperience, setSortByExperience] = useState(""); // "asc" or "desc"
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    let filtered = [...doctors];

    // Filter by speciality
    if (speciality) {
      filtered = filtered.filter((doc) => doc.speciality === speciality);
    }

    // Filter by search term (name)
    if (searchTerm) {
      filtered = filtered.filter((doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by experience
    if (sortByExperience === "asc") {
      filtered.sort((a, b) => parseInt(a.experience) - parseInt(b.experience));
    } else if (sortByExperience === "desc") {
      filtered.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
    }

    setFilterDoc(filtered);
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality, sortByExperience, searchTerm]);

  const toggleExperienceSort = (type) => {
    setSortByExperience((prev) => (prev === type ? "" : type));
  };

  return (
    <div>
      <p className="text-gray-600">
        Tìm kiếm bac sĩ theo các tiêu chí mong muốn.
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Bộ lọc
        </button>

        <div
          className={`flex-col gap-4 text-gray-600 ${
            showFilter ? "flex" : "hidden"
          }`}
        >
          {/* Search Bar */}
          <p className="font-medium">Tìm kiếm theo tên bác sĩ</p>
          <div className=" mb-4">
            <input
              type="text"
              placeholder="Search by doctor name..."
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <p className="font-medium">Chuyên ngành</p>
          <p
            onClick={() =>
              speciality === "Bác sĩ đa khoa"
                ? navigate("/doctors")
                : navigate("/doctors/Bác sĩ đa khoa")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Bác sĩ đa khoa" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Bác sĩ đa khoa
          </p>
          <p
            onClick={() =>
              speciality === "Bác sĩ phụ khoa"
                ? navigate("/doctors")
                : navigate("/doctors/Bác sĩ phụ khoa")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Bác sĩ phụ khoa" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Bác sĩ phụ khoa
          </p>
          <p
            onClick={() =>
              speciality === "Bác sĩ da liễu"
                ? navigate("/doctors")
                : navigate("/doctors/Bác sĩ da liễu")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Bác sĩ da liễu" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Bác sĩ da liễu
          </p>
          <p
            onClick={() =>
              speciality === "Bác sĩ nhi khoa"
                ? navigate("/doctors")
                : navigate("/doctors/Bác sĩ nhi khoa")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Bác sĩ nhi khoa" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Bác sĩ nhi khoa
          </p>
          <p
            onClick={() =>
              speciality === "Bác sĩ thần kinh"
                ? navigate("/doctors")
                : navigate("/doctors/Bác sĩ thần kinh")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Bác sĩ thần kinh"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Bác sĩ thần kinh
          </p>
          <p
            onClick={() =>
              speciality === "Bác sĩ chuyên khoa nội"
                ? navigate("/doctors")
                : navigate("/doctors/Bác sĩ chuyên khoa nội")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Bác sĩ chuyên khoa nội"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Bác sĩ chuyên khoa nội
          </p>

          {/* Experience filter section */}
          <p className="font-medium mt-4">Kinh Nghiệm</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => toggleExperienceSort("asc")}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer text-left ${
                sortByExperience === "asc" ? "bg-indigo-100 text-black" : ""
              }`}
            >
              Thấp đến cao
            </button>
            <button
              onClick={() => toggleExperienceSort("desc")}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer text-left ${
                sortByExperience === "desc" ? "bg-indigo-100 text-black" : ""
              }`}
            >
              Cao xuống thấp
            </button>
          </div>
        </div>
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              key={index}
            >
              <img
                className="bg-blue-50 hover:bg-primary transition-all duration-500"
                src={item.image}
                alt=""
              />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-center ">
                  <p
                    className={`w-2 h-2 ${
                      item.available
                        ? "bg-green-500 text-green-500"
                        : "bg-gray-500 text-gray-500"
                    } rounded-full`}
                  ></p>
                  <p>{item.available ? "Available" : "Not Available"}</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
                <button className="py-0.5 px-2 border text-xs rounded-full">
                  {item.experience}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
