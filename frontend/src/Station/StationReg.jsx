import React, { useRef, useState } from "react";

function StationReg() {
  const [stationname, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [chargingtype, setChargingtype] = useState('');
  const [gender,setGender]=useState('');
  const [toilet,setToilet]=useState('');
  const [water,setWater]=useState('');
  const [toiletpaper,setToiletpaper]=useState('');
  const [changingroom,setChangingroom]=useState();
  const [feedingroom,setFeedingroom]=useState('');
  const [handryer,setHandreyer]=useState('');
  const [sanitarybin,setSanitarybin]=useState('');
  const [wheelchair,setWheelchair]=useState('');
  const [emergency,setEmergency]=useState('');
  const [notes,setNotes]=useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showRestroomForm, setShowRestroomForm] = useState(false);
  const [auth]=useState(JSON.parse(localStorage.getItem('yourstorage')));
  // console.log(auth.userid, "authvendorid")

  const API_KEY = "n4Yzg7yiZdGPqjicI88XfHyRY7SBuMsaProAtSD0";

  const fetchSuggestions = async (input) => {
    if (!input) {
      setLocationSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`https://api.olamaps.io/places/v1/autocomplete?input=${input}&api_key=${API_KEY}`);
      const data = await response.json();
      if (data?.predictions) {
        setLocationSuggestions(data.predictions.map((item) => ({
          description: item.description,
          id: item.place_id,
        })));
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const fetchPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(`https://api.olamaps.io/places/v1/details?place_id=${placeId}&api_key=${API_KEY}`);
      const data = await response.json();
      if (data?.result?.geometry?.location) {
        setLat(data.result.geometry.location.lat);
        setLng(data.result.geometry.location.lng);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const handleLocationSelect = (suggestion) => {
    setLocation(suggestion.description);
    setLocationSuggestions([]);
    fetchPlaceDetails(suggestion.id);
  };

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateName = (value) => !value.trim() ? "Station Name is required" : value.length < 2 ? "Must be at least 2 characters" : "";
  const validatePhone = (value) => !value.trim() ? "Phone is required" : !/^\d{10}$/.test(value) ? "Invalid phone number" : "";
  const validateEmail = (value) => !value.trim() ? "Email is required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email" : "";
  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Minimum 6 characters";
    if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value)) {
      return "Must contain upper, lower, and number";
    }
    return "";
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    let error = "";
    switch (field) {
      case "stationname": error = validateName(stationname); break;
      case "phone": error = validatePhone(phone); break;
      case "email": error = validateEmail(email); break;
      case "password": error = validatePassword(password); break;
      default: break;
    }
    setErrors({ ...errors, [field]: error });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const newErrors = {
      stationname: validateName(stationname),
      phone: validatePhone(phone),
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(newErrors);
    setTouched({ stationname: true, phone: true, email: true, password: true });

    if (Object.values(newErrors).some(Boolean)) return;

    const data = {
      stationname,
      phone,
      location,
      chargingtype,
      lat,
      lng,
      email,
      password,
      usertype: 1,
      ownerid:auth.userid,
        ...(showRestroomForm && {
    restroom: {
      gender,
      toilet,
      water,
      toiletpaper,
      changingroom,
      feedingroom,
      handryer,
      sanitarybin,
      wheelchair,
      emergency
    }
  })

    };

    try {
      const res = await fetch('http://localhost:4000/ev/stationreg', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to submit");
      await res.json();
      alert("Station registered successfully");
      setName('');
      setPhone('');
      setLocation('');
      setChargingtype('');
      setGender('');
      setToilet('');
      setWater('');
      setToiletpaper('');
      setChangingroom('');
      setFeedingroom('');
      setHandreyer('');
      setSanitarybin('');
      setWheelchair('');
      setEmergency('');
      setEmail('');
      setPassword('');
      setLat(null);
      setLng(null);
      setTouched({});
      setErrors({});
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting station registration");
    }
  };

  return (
    <div className="card p-4 shadow-lg mx-auto my-5" style={{ maxWidth: "500px", borderRadius: "20px" }}>
      <h2 className="text-center mb-4 text-primary fw-bold">Register Station</h2>
      <form onSubmit={handleForm}>
        <div className="form-group mb-3">
          <label>Station Name</label>
          <input type="text" className={`form-control ${touched.stationname && errors.stationname ? 'is-invalid' : ''}`} value={stationname} onChange={(e) => setName(e.target.value)} onBlur={() => handleBlur("stationname")} required />
          {touched.stationname && errors.stationname && <div className="invalid-feedback">{errors.stationname}</div>}
        </div>

        <div className="form-group mb-3">
          <label>Contact Number</label>
          <input type="tel" className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : ''}`} value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => handleBlur("phone")} required />
          {touched.phone && errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
        </div>

        <div className="mb-3 position-relative">
          <label>Location</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            required
          />
          <ul className="list-group position-absolute w-100 z-3">
            {locationSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="list-group-item list-group-item-action"
                onClick={() => handleLocationSelect(suggestion)}
              >
                {suggestion.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-3">
          <label>Charging Type</label>
          <select className="form-select" value={chargingtype} onChange={(e) => setChargingtype(e.target.value)} required>
            <option value="">Select Charging Type</option>
            <option value="AC">AC(Regular)</option>
            <option value="DC">DC(Fast Charging)</option>
          </select>
        </div>

        <div className="form-group mb-3">
          <label>Email</label>
          <input type="email" className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`} value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => handleBlur("email")} required />
          {touched.email && errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="form-group mb-3">
          <label>Password</label>
          <input type="password" className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`} value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => handleBlur("password")} required />
          {touched.password && errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        <div>
          <label>Add Restroom</label>
          <input type="radio" name="restroom" value="yes" onChange={() => setShowRestroomForm(true)}/> Yes
          <input type="radio" name="restroom" value="no" onChange={() => setShowRestroomForm(false)}/> No
        </div>
            {showRestroomForm && (
              <>
              <div className="form-group mb-2">
  <label>Restroom Gender</label>
  <select className="form-select" value={gender} onChange={(e)=>setGender(e.target.value)}>
    <option value="">Select</option>
    <option value="unisex">Unisex</option>
    <option value="male">Male</option>
    <option value="female">Female</option>
    <option value="both">Male & Female Separate</option>
  </select>
</div>

<div className="form-group mb-2">
  <label>Toilet Type</label>
  <select className="form-select" value={toilet} onChange={(e)=>setToilet(e.target.value)}>
    <option value="">Select</option>
    <option value="western">Western</option>
    <option value="indian">Indian (Squat)</option>
    <option value="both">Both</option>
  </select>
</div>



<div className="form-group mb-2">
  <label>Water Available?</label>
  <select className="form-select" value={water} onChange={(e)=>setWater(e.target.value)}>
    <option value="">Select</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>
</div>

<div className="form-group mb-2">
  <label>Toilet Paper Available?</label>
  <select className="form-select" value={toiletpaper} onChange={(e)=>setToiletpaper(e.target.value)}>
    <option value="">Select</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>
</div>

<div className="form-group mb-2">
  <label>Changing Room Available?</label>
  <select className="form-select" value={changingroom} onChange={(e)=>setChangingroom(e.target.value)}>
    <option value="">Select</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>
</div>

<div className="form-group mb-2">
  <label>Feeding Room Available?</label>
  <select className="form-select" value={feedingroom} onChange={(e)=>setFeedingroom(e.target.value)}>
    <option value="">Select</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>
</div>

<div className="form-group mb-2">
  <label>Hand Dryer Available?</label>
  <select className="form-select" value={handryer} onChange={(e)=>setHandreyer(e.target.value)}>
    <option value="">Select</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>
</div>

<div className="form-group mb-2">
  <label>Sanitary Napkin Disposal?</label>
  <select className="form-select" value={sanitarybin} onChange={(e)=>setSanitarybin(e.target.value)}>
    <option value="">Select</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>
</div>

<div className="form-group mb-2">
  <label>Accessible for Wheelchair?</label>
  <select className="form-select" value={wheelchair} onChange={(e)=>setWheelchair(e.target.value)}>
    <option value="">Select</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>
</div>

<div className="form-group mb-2">
  <label>Emergency Call Button?</label>
  <select className="form-select" value={emergency} onChange={(e)=>setEmergency(e.target.value)}>
    <option value="">Select</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>
</div>
              </>
            )}

        <button type="submit" className="btn btn-primary w-100 fw-bold" onClick={handleForm}>Add Station</button>
      </form>
    </div>
  );
}

export default StationReg;
