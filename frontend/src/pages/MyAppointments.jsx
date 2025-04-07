import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [paypalReady, setPaypalReady] = useState(false);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${
      import.meta.env.VITE_PAYPAL_CLIENT_ID
    }&currency=USD`;
    script.addEventListener("load", () => setPaypalReady(true));
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt12 font-medium text-zinc-700 border-b">
        Cuộc Hẹn Của Tôi
      </p>
      <div>
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={index}
          >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={item.docData.image}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Địa điểm:</p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Thời gian:
                </span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">
                  Đã Thanh Toán
                </button>
              )}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <div className="w-full">
                  {paypalReady ? (
                    <PayPalScriptProvider
                      options={{
                        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
                        currency: "USD",
                        components: "buttons",
                      }}
                    >
                      <PayPalButtons
                        style={{
                          layout: "vertical",
                          color: "gold",
                          shape: "rect",
                          label: "paypal",
                        }}
                        createOrder={(data, actions) => {
                          return fetch(
                            `${backendUrl}/api/payment/create-payment`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                token: token,
                              },
                              body: JSON.stringify({
                                appointmentId: item._id,
                                amount: item.amount,
                              }),
                            }
                          )
                            .then((res) => res.json())
                            .then((order) => order.id);
                        }}
                        onApprove={(data, actions) => {
                          return fetch(
                            `${backendUrl}/api/payment/capture-payment`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                token: token,
                              },
                              body: JSON.stringify({
                                orderID: data.orderID,
                                appointmentId: item._id,
                              }),
                            }
                          )
                            .then((res) => {
                              if (!res.ok)
                                throw new Error("Payment capture failed");
                              return res.json();
                            })
                            .then(() => {
                              toast.success("Thanh Toán Thành Công");
                              getUserAppointments();
                            })
                            .catch((error) => {
                              toast.error("Payment verification failed");
                              console.error("Capture Error:", error);
                            });
                        }}
                        onError={(err) => {
                          toast.error("Payment failed: " + err.message);
                          console.error("PayPal Error:", err);
                        }}
                      />
                    </PayPalScriptProvider>
                  ) : (
                    <button
                      disabled
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded"
                    >
                      Loading PayPal...
                    </button>
                  )}
                </div>
              )}
              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red hover:text-white hover:bg-red-500 transition-all duration-300"
                >
                  Hủy Cuộc Hẹn
                </button>
              )}
              {item.cancelled && !item.isCompleted && (
                <button className="text-sm text-red-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red  border-red-500">
                  Cuộc Hẹn Đã Bị Hủy
                </button>
              )}
              {item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                  Hoàn Thành
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
