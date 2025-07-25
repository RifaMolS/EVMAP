import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import SignupModal from './SignupModal'; // Adjust the import path as necessary
import { Link } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
const closeModal = () => setIsModalOpen(false);

  // Validation functions
  const validateEmail = (value) => {
    if (!value) {
      return 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return 'Invalid email address';
    }
    return '';
  };

  const validatePassword = (value) => {
    if (!value) {
      return 'Password is required';
    } else if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  // Handle input changes with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setEmailError(validateEmail(value));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setPasswordError(validatePassword(value));
    }
  };

  // Set field as touched when focus leaves
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    if (field === 'email') {
      setEmailError(validateEmail(email));
    } else if (field === 'password') {
      setPasswordError(validatePassword(password));
    }
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // Validate all fields on submit
  const emailValidation = validateEmail(email);
  const passwordValidation = validatePassword(password);

  setEmailError(emailValidation);
  setPasswordError(passwordValidation);
  setTouched({ email: true, password: true });

  // If there is a password error, show alert and do not proceed
  if (passwordValidation) {
    alert(passwordValidation);
    return;
  }

  // If there is an email error, do not proceed
  if (emailValidation) {
    return;
  }

  // Only proceed if no validation errors
  handleLogin();
};
  const handleLogin = () => {
    setIsSubmitting(true);
    setLoginError('');
    
    const data = {
      email: email,
      password: password,
    };
  
    fetch('http://localhost:4000/ev/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Server error occurred');
        }
        return res.json();
      })
      .then((result) => {
  // Check for invalid login
  if (
    result === "invalid" ||
    !result ||
    !result.userid // or use another required property from your backend
  ) {
    setLoginError("Invalid email or password");
    return;
  }
  // Only log in if result is valid
  localStorage.setItem("yourstorage", JSON.stringify(result));
  window.location.href = "/";
})
      .catch((err) => {
        console.error("Error:", err);
        setLoginError("Connection error. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleBack = () => {
    console.log('Back button clicked');
    // Handle navigation back
  };

  const [tailwindReady, setTailwindReady] = useState(false);

  useEffect(() => {
    // Check if Tailwind is already loaded
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        {/* Back Button */}
       <button 
onClick={() => window.location.href = '/'}  
className="absolute top-4 left-4 text-gray-600 hover:text-gray-900 transition-colors"
  aria-label="Go back"
>
  <ArrowLeft size={24} />
</button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Login</h1>
          <p className="text-gray-500 mt-2">Please enter your credentials</p>
        </div>

        {loginError && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
            <AlertCircle size={20} className="mr-2 flex-shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-6">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur('email')}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-lg border ${
                  touched.email ? (emailError ? 'border-red-500' : 'border-green-500') : 'border-gray-300'
                } focus:outline-none focus:ring-2 ${
                  emailError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                } focus:border-transparent transition-all`}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : undefined}
              />
              {touched.email && !emailError && (
                <Check size={20} className="absolute right-3 top-3 text-green-500" />
              )}
            </div>
            {emailError && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {emailError}
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur('password')}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 rounded-lg border ${
                  touched.password ? (passwordError ? 'border-red-500' : 'border-green-500') : 'border-gray-300'
                } focus:outline-none focus:ring-2 ${
                  passwordError ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                } focus:border-transparent transition-all`}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? "password-error" : undefined}
              />
              {touched.password && !passwordError && (
                <Check size={20} className="absolute right-3 top-3 text-green-500" />
              )}
            </div>
            {passwordError && (
              <p id="password-error" className="mt-1 text-sm text-red-600">
                {passwordError}
              </p>
            )}
          </div>
          <div style={{display:'flex', marginLeft:'250px', width:'400px', marginBottom:'20px'}}>
             <Link to='/forgot-password'style={{color:'blue', marginRight:'100px'}}>Forgot Password?</Link>

          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              {/* <a href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign Up
              </a> */}
            </p>
          </div>
        </form>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button onClick={openModal}> signup</button>

      </div>
        <SignupModal isOpen={isModalOpen} onClose={closeModal} />

    </div>
  );
}