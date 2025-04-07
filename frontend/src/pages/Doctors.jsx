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
      <p className="text-gray-600">Browser through the doctors specialist.</p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>

        <div
          className={`flex-col gap-4 text-gray-600 ${
            showFilter ? "flex" : "hidden"
          }`}
        >
          {/* Search Bar */}
          <p className="font-medium">Tìm kiếm theo tên Bác sĩ</p>
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
              speciality === "General physician"
                ? navigate("/doctors")
                : navigate("/doctors/General physician")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "General physician"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            General physician
          </p>
          <p
            onClick={() =>
              speciality === "Gynecologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gynecologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Gynecologist
          </p>
          <p
            onClick={() =>
              speciality === "Dermatologist"
                ? navigate("/doctors")
                : navigate("/doctors/Dermatologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Dermatologist
          </p>
          <p
            onClick={() =>
              speciality === "Pediatricians"
                ? navigate("/doctors")
                : navigate("/doctors/Pediatricians")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Pediatricians
          </p>
          <p
            onClick={() =>
              speciality === "Neurologist"
                ? navigate("/doctors")
                : navigate("/doctors/Neurologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Neurologist
          </p>
          <p
            onClick={() =>
              speciality === "Gastroenterologist"
                ? navigate("/doctors")
                : navigate("/doctors/Gastroenterologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Gastroenterologist"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Gastroenterologist
          </p>

          {/* Experience filter section */}
          <p className="font-medium mt-4">Experience</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => toggleExperienceSort("asc")}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer text-left ${
                sortByExperience === "asc" ? "bg-indigo-100 text-black" : ""
              }`}
            >
              Low to High
            </button>
            <button
              onClick={() => toggleExperienceSort("desc")}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer text-left ${
                sortByExperience === "desc" ? "bg-indigo-100 text-black" : ""
              }`}
            >
              High to Low
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
