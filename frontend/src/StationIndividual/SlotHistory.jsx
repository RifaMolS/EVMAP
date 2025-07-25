import React, { useEffect, useState } from 'react';
import { Link, useParams,useNavigate } from 'react-router-dom'; 
import {ArrowLeft } from "lucide-react";

function SlotHistory() {
  const [slot, setSlot] = useState([]); 
  const [refresh, setRefresh] = useState(0);
  const [auth] = useState(JSON.parse(localStorage.getItem('yourstorage')));
  const {id} = useParams() 

  const navigate = useNavigate();

  
  useEffect(() => {
    let ids = {
      slotid: id, 
    };

    fetch('http://localhost:4000/ev/viewslothistory', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ids),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Response from backend:", result);
        setSlot(result);
      })
      .catch((err) => console.log('Error:', err));
  }, [refresh]);

   const handleBack = () => {
      navigate('/');
    };
    

  const statusData = {'1':'Not Completed','2':'Delay','3':'Cancelled','4':'Completed','5':'Started'}
  const statusButton = {'1':'btn btn-info btn-sm','2':'btn btn-warning btn-sm','3':'btn btn-danger btn-sm','4':'btn btn-success btn-sm','5':'btn btn-primary btn-sm'}
 
  return (
    <div className="container mt-4">
       <button style={{color:"black",fontSize:"25px",fontWeight:"bold"}} onClick={handleBack}>
                          <ArrowLeft size={20} />
                         </button>
      <h2 className="mb-3">All Slots</h2>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>User</th>
            <th>Contact</th> 
            <th>Charging Time</th> 
            <th>Amount</th>
            <th>Status</th> 
          </tr>
        </thead>
        <tbody>
          {slot.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No slots available</td>
            </tr>
          ) : (
            slot.map((item, index) => (
              <tr key={index}>
                <td>{item.booking_id?.created_at?.split('T')[0] || "N/A"}</td>
                <td>{item.booking_id?.start_time}</td>
                <td>{item?.user_id?.name}</td>
                <td>{item?.user_id?.phone}</td>
                <td>{item.booking_id?.charging_time}hrs</td>
                <td>₹{item.booking_id?.amount}</td>
                <td> <button disabled className={statusButton[item.status]}>{statusData[item.status]}</button> 
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SlotHistory;
