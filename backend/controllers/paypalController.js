import { client } from "../config/paypal.js";
import appointmentModel from "../models/appointmentModel.js";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";

const createPayment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Cuộc hẹn không có" });
    }

    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: appointment.amount.toString(),
          },
          description: `Appointment with Dr. ${appointment.docData.name}`,
        },
      ],
    });

    const order = await client().execute(request);
    res.json({ id: order.result.id });
  } catch (error) {
    console.error("PayPal Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const capturePayment = async (req, res) => {
  try {
    const { orderID, appointmentId } = req.body;

    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client().execute(request);

    if (capture.result.status !== "COMPLETED") {
      throw new Error("Thanh toán chưa hoàn tất");
    }

    // Cập nhật trạng thái thanh toán
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      payment: true,
      paymentDetails: capture.result,
    });

    res.json({
      success: true,
      data: capture.result,
      message: "Payment completed successfully",
    });
  } catch (error) {
    console.error("PayPal Capture Error:", error);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
};

export { capturePayment, createPayment };
