import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Mechanic = () => {
  // Styles
  const containerStyle = {
    background: 'linear-gradient(135deg, #ffffff, #f1f1f1)',
    padding: '50px',
    borderRadius: '30px',
    maxWidth: '700px',
    margin: '60px auto',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#000000',
  };

  const headingStyle = {
    textAlign: 'center',
    marginBottom: '40px',
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#000000',
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#000000',
    marginBottom: '5px',
    fontSize: '1rem'
  };

  const inputStyle = {
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    width: '100%'
  };

  const inputErrorStyle = {
    ...inputStyle,
    border: '1px solid #ff3333',
    backgroundColor: '#fff8f8'
  };

  const errorMessageStyle = {
    color: '#ff3333',
    fontSize: '0.85rem',
    marginTop: '5px',
    fontWeight: '500'
  };

  const btnStyle = {
    background: 'linear-gradient(90deg, #333333, #000000)',
    color: '#ffffff',
    fontWeight: '600',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '10px',
    marginTop: '30px',
    width: 'auto',
    fontSize: '0.9rem',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    display: 'inline-block',
    alignSelf: 'center'
  };

  // State
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [experience, setExperience] = useState('');
  const [address, setAddress] = useState('');
  const [time, setTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validation state
  const [errors, setErrors] = useState({
    name: '',
    contact: '',
    experience: '',
    address: '',
    time: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    contact: false,
    experience: false,
    address: false,
    time: false
  });

  // Validation functions
  const validateName = (value) => {
    if (!value.trim()) return "Name is required";
    if (value.trim().length < 3) return "Name must be at least 3 characters";
    return "";
  };

  const validateContact = (value) => {
    if (!value.trim()) return "Contact number is required";
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(value.replace(/\D/g, ''))) return "Please enter a valid 10-digit contact number";
    return "";
  };

  const validateExperience = (value) => {
    if (!value.trim()) return "Experience is required";
    if (isNaN(value) || parseInt(value) < 0) return "Experience must be a positive number";
    return "";
  };

  const validateAddress = (value) => {
    if (!value.trim()) return "Address is required";
    if (value.trim().length < 10) return "Please enter a complete address";
    return "";
  };

  const validateTime = (value) => {
    if (!value) return "Available time is required";
    return "";
  };

  // Handle blur events to trigger validation
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate the field
    let error = "";
    switch (field) {
      case "name":
        error = validateName(name);
        break;
      case "contact":
        error = validateContact(contact);
        break;
      case "experience":
        error = validateExperience(experience);
        break;
      case "address":
        error = validateAddress(address);
        break;
      case "time":
        error = validateTime(time);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Input change handlers with validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (touched.name) {
      setErrors(prev => ({ ...prev, name: validateName(value) }));
    }
  };

  const handleContactChange = (e) => {
    const value = e.target.value;
    setContact(value);
    if (touched.contact) {
      setErrors(prev => ({ ...prev, contact: validateContact(value) }));
    }
  };

  const handleExperienceChange = (e) => {
    const value = e.target.value;
    setExperience(value);
    if (touched.experience) {
      setErrors(prev => ({ ...prev, experience: validateExperience(value) }));
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    if (touched.address) {
      setErrors(prev => ({ ...prev, address: validateAddress(value) }));
    }
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    setTime(value);
    if (touched.time) {
      setErrors(prev => ({ ...prev, time: validateTime(value) }));
    }
  };

  // Validate entire form
  const validateForm = () => {
    const nameError = validateName(name);
    const contactError = validateContact(contact);
    const experienceError = validateExperience(experience);
    const addressError = validateAddress(address);
    const timeError = validateTime(time);
    
    const newErrors = {
      name: nameError,
      contact: contactError,
      experience: experienceError,
      address: addressError,
      time: timeError
    };
    
    setErrors(newErrors);
    setTouched({
      name: true,
      contact: true,
      experience: true,
      address: true,
      time: true
    });
    
    // Check if there are any errors
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleMechanic = () => {
    if (!validateForm()) {
      // Show validation errors alert
      alert("Please fix the errors in the form before submitting.");
      return;
    }
    
    // Show confirmation dialog
    const confirmSubmit = window.confirm("Are you sure you want to add this mechanic?");
    if (!confirmSubmit) {
      return;
    }
    
    setIsSubmitting(true);

    let data = {
      name: name,
      contact: contact,
      experience: experience,
      address: address,
      workingtime: time,
    };

    fetch('http://localhost:4000/ev/addmechanic', {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to submit data");
        }
        return res.json();
      })
      .then((result) => {
        console.log(result);
        // Reset form
        setName('');
        setContact('');
        setExperience('');
        setAddress('');
        setTime('');
        setErrors({
          name: '',
          contact: '',
          experience: '',
          address: '',
          time: ''
        });
        setTouched({
          name: false,
          contact: false,
          experience: false,
          address: false,
          time: false
        });
        alert("Mechanic added successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while submitting the data.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <motion.div 
      style={containerStyle}
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }}
    >
      <motion.h2 
        style={headingStyle} 
        initial={{ scale: 0.8 }} 
        animate={{ scale: 1 }} 
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Add Mechanic
      </motion.h2>

      <motion.div className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <label style={labelStyle} htmlFor="name">Name</label>
        <input 
          style={touched.name && errors.name ? inputErrorStyle : inputStyle} 
          type="text" 
          id="name"
          value={name} 
          onChange={handleNameChange}
          onBlur={() => handleBlur('name')}
          placeholder="Enter mechanic's name" 
        />
        {touched.name && errors.name && <div style={errorMessageStyle}>{errors.name}</div>}
      </motion.div>

      <motion.div className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <label style={labelStyle} htmlFor="contact">Contact</label>
        <input 
          style={touched.contact && errors.contact ? inputErrorStyle : inputStyle} 
          type="tel" 
          id="contact"
          value={contact} 
          onChange={handleContactChange}
          onBlur={() => handleBlur('contact')}
          placeholder="Enter contact number" 
        />
        {touched.contact && errors.contact && <div style={errorMessageStyle}>{errors.contact}</div>}
      </motion.div>

      <motion.div className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <label style={labelStyle} htmlFor="experience">Experience (years)</label>
        <input 
          style={touched.experience && errors.experience ? inputErrorStyle : inputStyle} 
          type="text" 
          id="experience"
          value={experience} 
          onChange={handleExperienceChange}
          onBlur={() => handleBlur('experience')}
          placeholder="Years of experience" 
        />
        {touched.experience && errors.experience && <div style={errorMessageStyle}>{errors.experience}</div>}
      </motion.div>

      <motion.div className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <label style={labelStyle} htmlFor="address">Address</label>
        <textarea 
          style={touched.address && errors.address ? inputErrorStyle : inputStyle} 
          id="address"
          value={address} 
          onChange={handleAddressChange}
          onBlur={() => handleBlur('address')}
          rows="3" 
          placeholder="Enter address"
        ></textarea>
        {touched.address && errors.address && <div style={errorMessageStyle}>{errors.address}</div>}
      </motion.div>

      <motion.div className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <label style={labelStyle} htmlFor="time">Available Time</label>
        <input 
          style={touched.time && errors.time ? inputErrorStyle : inputStyle} 
          type="text" 
          id="time"
          value={time} 
          onChange={handleTimeChange}
          onBlur={() => handleBlur('time')}
        />
        {touched.time && errors.time && <div style={errorMessageStyle}>{errors.time}</div>}
      </motion.div>

      <motion.button 
        style={btnStyle}
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        onClick={handleMechanic}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </motion.button>
    </motion.div>
  );
};

export default Mechanic;