import React, { useEffect, useState } from 'react';
import { FaUser, FaPhone, FaMapMarkerAlt, FaIdCard, FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [license, setLicense] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  
  // Validation states
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    address: '',
    license: '',
    email: '',
    password: '',
  });
  
  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    address: false,
    license: false,
    email: false,
    password: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validation functions
  const validateName = (value) => {
    if (!value.trim()) return "Name is required";
    if (value.trim().length < 3) return "Name must be at least 3 characters";
    return "";
  };
  
  const validatePhone = (value) => {
    if (!value.trim()) return "Phone number is required";
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(value.replace(/\D/g, ''))) return "Please enter a valid 10-digit phone number";
    return "";
  };
  
  const validateAddress = (value) => {
    if (!value.trim()) return "Address is required";
    if (value.trim().length < 10) return "Please enter a complete address";
    return "";
  };
  
  const validateLicense = (file) => {
    if (!file) return "License file is required";
    
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) return "Only JPG, JPEG, and PNG files are allowed";
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) return "File size must be less than 5MB";
    
    return "";
  };
  
  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };
  
  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    
    // Check for strong password (at least one uppercase, one lowercase, one number, one special character)
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    
    if (!(hasUpperCase && hasLowerCase && hasNumber && hasSpecial)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }
    
    return "";
  };
  
  // Handle blur events to show validation messages
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    
    // Validate the field
    let error = "";
    switch (field) {
      case "name":
        error = validateName(name);
        break;
      case "phone":
        error = validatePhone(phone);
        break;
      case "address":
        error = validateAddress(address);
        break;
      case "license":
        error = license ? validateLicense(license) : "License file is required";
        break;
      case "email":
        error = validateEmail(email);
        break;
      case "password":
        error = validatePassword(password);
        break;
      default:
        break;
    }
    
    setErrors({ ...errors, [field]: error });
  };
  
  // Handle input changes with validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (touched.name) {
      setErrors({ ...errors, name: validateName(value) });
    }
  };
  
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    if (touched.phone) {
      setErrors({ ...errors, phone: validatePhone(value) });
    }
  };
  
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    if (touched.address) {
      setErrors({ ...errors, address: validateAddress(value) });
    }
  };
  
  const handleLicenseChange = (e) => {
    const file = e.target.files[0];
    setLicense(file);
    if (touched.license) {
      setErrors({ ...errors, license: file ? validateLicense(file) : "License file is required" });
    }
  };
  
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setErrors({ ...errors, email: validateEmail(value) });
    }
  };
  
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors({ ...errors, password: validatePassword(value) });
    }
  };
  
  // Validate entire form
  const validateForm = () => {
    const nameError = validateName(name);
    const phoneError = validatePhone(phone);
    const addressError = validateAddress(address);
    const licenseError = license ? validateLicense(license) : "License file is required";
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    const newErrors = {
      name: nameError,
      phone: phoneError,
      address: addressError,
      license: licenseError,
      email: emailError,
      password: passwordError
    };
    
    setErrors(newErrors);
    setTouched({
      name: true,
      phone: true,
      address: true,
      license: true,
      email: true,
      password: true
    });
    
    // Check if there are any errors
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleForm = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Show alert for validation errors
      alert("Please fix the errors in the form before submitting.");
      return;
    }
    
    // Show confirmation dialog
    const confirmSubmit = window.confirm("Are you sure you want to register with these details?");
    if (!confirmSubmit) {
      return;
    }
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("license", license); // this is now a File
    formData.append("email", email);
    formData.append("password", password);
    formData.append("usertype", 0);

    fetch("http://localhost:4000/ev/register", {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Registration failed");
        }
        return res.json();
      })
      .then((result) => {
        console.log(result);
        // Show success alert
        alert("Registration successful! You can now login.");
        
        // Reset form
        setName('');
        setPhone('');
        setAddress('');
        setLicense(null);
        setEmail('');
        setPassword('');
        setTouched({
          name: false,
          phone: false,
          address: false,
          license: false,
          email: false,
          password: false
        });
        setErrors({
          name: '',
          phone: '',
          address: '',
          license: '',
          email: '',
          password: ''
        });
      })
      .catch((err) => {
        console.error("Registration error:", err);
        alert("Registration failed. Please try again later.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  
  useEffect(() => {
    fetch("http://localhost:4000/ev/viewreg")
      .then((res) => res.json())
      .then((result) => {
        console.log("Loaded data:", result);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{
      backgroundColor: 'white',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '30px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 15px 25px rgba(0, 0, 0, 0.1)',
        animation: 'fadeIn 0.8s ease forwards'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#4a00e0',
          fontWeight: '700',
          fontSize: '32px'
        }}>Create Account</h2>
        
        <form onSubmit={handleForm}>
          <div style={{ 
            marginBottom: errors.name ? '5px' : '20px', 
            animation: 'slideIn 0.5s ease forwards',
            animationDelay: '0.1s',
            opacity: 0
          }}>
            <div className={`input-group ${touched.name && errors.name ? 'has-validation' : ''}`}>
              <span className="input-group-text" style={{ backgroundColor: '#4a00e0', color: 'white' }}>
                <FaUser />
              </span>
              <input
                type="text"
                className={`form-control ${touched.name && errors.name ? 'is-invalid' : touched.name && !errors.name ? 'is-valid' : ''}`}
                placeholder="Full Name"
                name="name"
                value={name}
                onChange={handleNameChange}
                onBlur={() => handleBlur('name')}
                style={{ 
                  height: '50px',
                  transition: 'all 0.3s ease',
                  borderLeft: 'none'
                }}
                required
              />
            </div>
            {touched.name && errors.name && (
              <div className="text-danger" style={{ fontSize: '12px', marginLeft: '5px', marginBottom: '15px' }}>
                {errors.name}
              </div>
            )}
          </div>

          <div style={{ 
            marginBottom: errors.phone ? '5px' : '20px', 
            animation: 'slideIn 0.5s ease forwards',
            animationDelay: '0.2s',
            opacity: 0
          }}>
            <div className="input-group">
              <span className="input-group-text" style={{ backgroundColor: '#4a00e0', color: 'white' }}>
                <FaPhone />
              </span>
              <input
                type="tel"
                className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : touched.phone && !errors.phone ? 'is-valid' : ''}`}
                placeholder="Phone Number"
                name="phone"
                value={phone}
                onChange={handlePhoneChange}
                onBlur={() => handleBlur('phone')}
                style={{ 
                  height: '50px',
                  transition: 'all 0.3s ease',
                  borderLeft: 'none'
                }}
                required
              />
            </div>
            {touched.phone && errors.phone && (
              <div className="text-danger" style={{ fontSize: '12px', marginLeft: '5px', marginBottom: '15px' }}>
                {errors.phone}
              </div>
            )}
          </div>

          <div style={{ 
            marginBottom: errors.address ? '5px' : '20px', 
            animation: 'slideIn 0.5s ease forwards',
            animationDelay: '0.3s',
            opacity: 0
          }}>
            <div className="input-group">
              <span className="input-group-text" style={{ backgroundColor: '#4a00e0', color: 'white' }}>
                <FaMapMarkerAlt />
              </span>
              <textarea
                className={`form-control ${touched.address && errors.address ? 'is-invalid' : touched.address && !errors.address ? 'is-valid' : ''}`}
                placeholder="Address"
                name="address"
                value={address}
                onChange={handleAddressChange}
                onBlur={() => handleBlur('address')}
                style={{ 
                  minHeight: '100px',
                  transition: 'all 0.3s ease',
                  borderLeft: 'none'
                }}
                required
              ></textarea>
            </div>
            {touched.address && errors.address && (
              <div className="text-danger" style={{ fontSize: '12px', marginLeft: '5px', marginBottom: '15px' }}>
                {errors.address}
              </div>
            )}
          </div>

          <div style={{ 
            marginBottom: errors.license ? '5px' : '20px', 
            animation: 'slideIn 0.5s ease forwards',
            animationDelay: '0.4s',
            opacity: 0
          }}>
            <div className="input-group">
              <span className="input-group-text" style={{ backgroundColor: '#4a00e0', color: 'white' }}>
                <FaIdCard />
              </span>
              <input
                type="file"
                className={`form-control ${touched.license && errors.license ? 'is-invalid' : touched.license && !errors.license ? 'is-valid' : ''}`}
                name="license"
                accept="image/*"
                onChange={handleLicenseChange}
                onBlur={() => handleBlur('license')}
                style={{ 
                  height: '50px',
                  transition: 'all 0.3s ease',
                  borderLeft: 'none'
                }}
                required
              />
            </div>
            {touched.license && errors.license ? (
              <div className="text-danger" style={{ fontSize: '12px', marginLeft: '5px', marginBottom: '15px' }}>
                {errors.license}
              </div>
            ) : (
              <small className="form-text text-muted" style={{ fontSize: '12px', marginLeft: '5px' }}>
                Upload your license as an image (JPG, JPEG, PNG, max 5MB)
              </small>
            )}
          </div>

          <div style={{ 
            marginBottom: errors.email ? '5px' : '20px', 
            animation: 'slideIn 0.5s ease forwards',
            animationDelay: '0.5s',
            opacity: 0
          }}>
            <div className="input-group">
              <span className="input-group-text" style={{ backgroundColor: '#4a00e0', color: 'white' }}>
                <FaEnvelope />
              </span>
              <input
                type="email"
                className={`form-control ${touched.email && errors.email ? 'is-invalid' : touched.email && !errors.email ? 'is-valid' : ''}`}
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur('email')}
                style={{ 
                  height: '50px',
                  transition: 'all 0.3s ease',
                  borderLeft: 'none'
                }}
                required
              />
            </div>
            {touched.email && errors.email && (
              <div className="text-danger" style={{ fontSize: '12px', marginLeft: '5px', marginBottom: '15px' }}>
                {errors.email}
              </div>
            )}
          </div>

          <div style={{ 
            marginBottom: errors.password ? '5px' : '20px', 
            animation: 'slideIn 0.5s ease forwards',
            animationDelay: '0.6s',
            opacity: 0
          }}>
            <div className="input-group">
              <span className="input-group-text" style={{ backgroundColor: '#4a00e0', color: 'white' }}>
                <FaLock />
              </span>
              <input
                type="password"
                className={`form-control ${touched.password && errors.password ? 'is-invalid' : touched.password && !errors.password ? 'is-valid' : ''}`}
                placeholder="Password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur('password')}
                style={{ 
                  height: '50px',
                  transition: 'all 0.3s ease',
                  borderLeft: 'none'
                }}
                required
              />
            </div>
            {touched.password && errors.password && (
              <div className="text-danger" style={{ fontSize: '12px', marginLeft: '5px', marginBottom: '15px' }}>
                {errors.password}
              </div>
            )}
          </div>

          <div style={{ 
            animation: 'slideIn 0.5s ease forwards',
            animationDelay: '0.7s',
            opacity: 0
          }}>
            <button 
              type="submit" 
              className="btn btn-lg w-100"
              disabled={isSubmitting}
              style={{
                backgroundColor: isSubmitting ? '#8252e0' : '#4a00e0',
                color: 'white',
                height: '55px',
                fontSize: '18px',
                fontWeight: '600',
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(74, 0, 224, 0.3)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
              onMouseOver={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = '#6a26e0';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 7px 20px rgba(74, 0, 224, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isSubmitting) {
                  e.target.style.backgroundColor = '#4a00e0';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(74, 0, 224, 0.3)';
                }
              }}
            >
              <FaSignInAlt style={{ marginRight: '10px' }} /> 
              {isSubmitting ? 'Registering...' : 'Register Now'}
            </button>
          </div>
        </form>
        
        <p style={{ 
          marginTop: '20px',
          textAlign: 'center',
          color: '#666',
          fontSize: '14px',
          animation: 'fadeIn 0.8s ease forwards',
          animationDelay: '0.8s',
          opacity: 0
        }}>
          Already have an account? <a href="/signin" style={{ color: '#4a00e0', textDecoration: 'none', fontWeight: '600' }}>Sign In</a>
        </p>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideIn {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .form-control.is-valid {
            border-color: #198754;
            padding-right: calc(1.5em + 0.75rem);
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23198754' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right calc(0.375em + 0.1875rem) center;
            background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
          }
          
          .form-control.is-invalid {
            border-color: #dc3545;
            padding-right: calc(1.5em + 0.75rem);
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right calc(0.375em + 0.1875rem) center;
            background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
          }
        `}</style>
      </div>
    </div>
  );
};

export default RegistrationForm;