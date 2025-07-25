import React, { useEffect, useState} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";


function AllSlots() {
  const [slot, setSlot] = useState([]); 
  const [slotsAvailablity, setSlotsAvailablity] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [auth] = useState(JSON.parse(localStorage.getItem('yourstorage')));


    const navigate = useNavigate();


  useEffect(() => {
    let ids = {
      stationId: auth?.userid, 
    };

    fetch('http://localhost:4000/ev/viewslotforstation', {
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

  const [tailwindReady, setTailwindReady] = useState(false);

  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://cdn.tailwindcss.com";
      script.onload = () => setTailwindReady(true);
      document.head.appendChild(script);
    } else {
      setTailwindReady(true);
    }

    return () => {
      const script = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
      if (script) {
        document.head.removeChild(script);
        setTailwindReady(false);
      }
    };
  }, []);

  if (!tailwindReady) {
    return <div>Loading form styles...</div>;
  }
  return (
    <div className="container mt-4">
       <button style={{color:"black",fontSize:"25px",fontWeight:"bold"}} onClick={handleBack}>
                    <ArrowLeft size={20} />
                   </button>
      <h2 className="mb-3">All Slots</h2>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Station Name</th>
            <th>Location</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Amount</th> 
            <th>Status</th> 
            <th>History</th> 
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
                <td>{item.sid?.stationname || "N/A"}</td>
                <td>{item.sid?.location}</td>
                <td>{item.starttime}</td>
                <td>{item.endtime}</td>
                <td>₹{item.amount}/KWh</td>
                <td>{item.payment_id?._id!=null?([3,4,2].includes(item.payment_id?.status)?'Available':'Unavailable'):'Available'}</td>
                <td><Link to={`/slothistory/${item._id}`} state={{id:item._id}}><button className="btn btn-success btn-sm">View</button></Link> 
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AllSlots;
