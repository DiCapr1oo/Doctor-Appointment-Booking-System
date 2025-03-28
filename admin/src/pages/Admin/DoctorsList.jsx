import React, { useState, useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } =
    useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-medium">All Doctors</h1>

        {/* Search button for small screens */}
        <button
          className="sm:hidden p-2 rounded-md bg-indigo-100 text-indigo-700"
          onClick={() => setShowSearch(!showSearch)}
        >
          {showSearch ? "Hide Search" : "Search"}
        </button>
      </div>

      {/* Search Bar - hidden on small screens unless toggled */}
      <div className={`${showSearch ? "block" : "hidden"} sm:block my-4`}>
        <input
          type="text"
          placeholder="Search by doctor name..."
          className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap w-full gap-4 pt-5 gap-y-6">
        {filteredDoctors.map((item, index) => (
          <div
            className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer"
            key={index}
          >
            <img
              className="bg-indigo-50 hover:bg-primary transition-all duration-500"
              src={item.image}
              alt=""
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">
                {item.name}
              </p>
              <p className="text-zinc-600 text-sm">{item.speciality}</p>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <input
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;
