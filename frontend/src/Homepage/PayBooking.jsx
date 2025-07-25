import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ArrowLeft } from "lucide-react";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 1rem;
`;

const Card = styled.div`
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #4b5563;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    color: #1f2937;
  }
`;

const Detail = styled.p`
  font-size: 0.95rem;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const PayButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #16a34a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #15803d;
  }
`;

function PayBooking() {
  const [auth] = useState(JSON.parse(localStorage.getItem("yourstorage")));
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    return <p>No booking details available.</p>;
  }

  const initPay = (data, slot) => {
    const options = {
      key: "rzp_test_4Ex6Tyjkp79GFy",
      amount: data.amount,
      currency: data.currency,
      name: booking.slot_id?.sid?.stationname || "N/A",
      description: "Book slot",
      order_id: data.id,
      handler: async (response) => {
        try {
          const verifyURL = "http://localhost:4000/api/payment/verify";

          const payload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            user_id: auth.userid,
            slot_id: slot._id,
            price: slot.amount,
            sid: booking.slot_id,
            booking_id: booking._id,
            ownerid: booking.ownerid || null,
            status: 1,
          };

          const res = await fetch(verifyURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          const result = await res.json();
          console.log("Payment Successful", result);
          navigate("/slots");
        } catch (error) {
          console.error(error);
        }
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePay = async (slot) => {
    try {
      const orderURL = "http://localhost:4000/api/payment/orders";
      const res = await fetch(orderURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: (booking.amount || 0) * 100 }),
      });
      const resData = await res.json();
      console.log("Order data:", resData);
      initPay(resData.data, slot);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Card>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={18} style={{ marginRight: "6px" }} /> Back
          </BackButton>
          <Title>Payment Details</Title>
        </Header>

        <Detail>
          <strong>Station Name:</strong> {booking.slot_id?.sid?.stationname || "N/A"}
        </Detail>
        <Detail>
          <strong>Location:</strong> {booking.slot_id?.sid?.location || "N/A"}
        </Detail>
        <Detail>
          <strong>Start Time:</strong> {booking.start_time}
        </Detail>
        <Detail>
          <strong>Charging Time:</strong> {booking.charging_time} hours
        </Detail>
        <Detail>
          <strong>Amount:</strong> ₹{booking.amount}/kW
        </Detail>

        <PayButton onClick={() => handlePay(booking.slot_id)}>Pay Now</PayButton>
      </Card>
    </Container>
  );
}

export default PayBooking;
