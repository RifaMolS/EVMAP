import React, { useState, useEffect } from 'react';

const SignupModal = ({ isOpen, onClose }) => {
  const [activeOption, setActiveOption] = useState(null);
  const [animationStage, setAnimationStage] = useState('initial');

  useEffect(() => {
    if (isOpen) {
      setAnimationStage('entering');
      // Delay to allow entering animation to finish before allowing "active" animations
      const timer = setTimeout(() => {
        setAnimationStage('active');
      }, 300);
      
      // Hide scrollbars and prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
      
      return () => {
        clearTimeout(timer);
      };
    } else {
      setAnimationStage('initial');
      setActiveOption(null);
      
      // Restore scrolling when modal is closed
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOptionClick = (option) => {
    setActiveOption(option);
  };

  const handleContinue = () => {
    if (activeOption === 'user') {
      window.location.href = '/signup';
    } else if (activeOption === 'station') {
      // Add navigation for station if needed
      window.location.href = '/stationregister';
    }
    // Restore scrolling when navigating away
    document.body.style.overflow = '';
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create Your Account</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="welcome-text">
            <h3>Welcome to EV Charging Network</h3>
            <p>Select your account type to get started</p>
          </div>
          
          <div className="options-container">
            <div 
              className={`option-card ${activeOption === 'user' ? 'active' : ''}`}
              onClick={() => handleOptionClick('user')}
            >
              <div className="option-icon">
                <div className="icon-inner">
                  <i className="fas fa-user"></i>
                </div>
              </div>
              <h4>EV User</h4>
              <p>Find and access charging stations for your electric vehicle</p>
              <ul className="feature-list">
                <li><i className="fas fa-check"></i> Find nearby stations</li>
                <li><i className="fas fa-check"></i> Book charging slots</li>
                <li><i className="fas fa-check"></i> Pay securely online</li>
              </ul>
            </div>
            
            <div 
              className={`option-card ${activeOption === 'station' ? 'active' : ''}`}
              onClick={() => handleOptionClick('station')}
            >
              <div className="option-icon">
                <div className="icon-inner">
                  <i className="fas fa-charging-station"></i>
                </div>
              </div>
              <h4>Station Owner</h4>
              <p>Register and manage your EV charging stations</p>
              <ul className="feature-list">
                <li><i className="fas fa-check"></i> List your stations</li>
                <li><i className="fas fa-check"></i> Manage bookings</li>
                <li><i className="fas fa-check"></i> Track revenue</li>
              </ul>
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              className={`btn-style1 primary`} 
              onClick={onClose}
            >
              <span>Cancel</span>
            </button>
            <button 
              className={`btn-style1 primary continue-btn ${activeOption ? 'active' : 'disabled'}`}
              onClick={activeOption ? handleContinue : undefined}
              disabled={!activeOption}
            >
              <span>Continue</span>
              {activeOption && <i className="fas fa-arrow-right"></i>}
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999; /* Increased z-index to ensure modal is above all content */
          backdrop-filter: blur(5px);
          perspective: 1000px;
          animation: ${animationStage === 'entering' ? 'fadeIn 0.3s ease forwards' : 'none'};
        }
        
        .modal-container {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
                      0 0 0 1px rgba(255, 255, 255, 0.1),
                      0 0 40px rgba(0, 0, 0, 0.1) inset;
          width: 90%;
          max-width: 800px;
          overflow: hidden;
          transform-origin: center;
          animation: ${animationStage === 'entering' ? 'scaleIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) forwards' : 'none'};
          max-height: 90vh; /* Limit height and enable scrolling for small screens */
          overflow-y: auto;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px 30px;
          background: linear-gradient(90deg, #0d6efd 0%, #0dcaf0 100%);
          color: white;
          border-bottom: none;
          position: relative;
          position: sticky; /* Make header sticky when scrolling */
          top: 0;
          z-index: 10;
        }
        
        .modal-header::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            rgba(255,255,255,0) 0%, 
            rgba(255,255,255,0.5) 50%, 
            rgba(255,255,255,0) 100%);
        }
        
        .modal-title {
          font-size: 24px;
          margin: 0;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .close-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          font-size: 24px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          padding: 0;
          line-height: 1;
        }
        
        .close-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }
        
        .modal-body {
          padding: 30px;
        }
        
        .welcome-text {
          text-align: center;
          margin-bottom: 30px;
          animation: ${animationStage === 'entering' ? 'slideDown 0.5s ease 0.2s forwards' : 'none'};
          opacity: ${animationStage === 'initial' ? '0' : '1'};
        }
        
        .welcome-text h3 {
          font-size: 22px;
          color: #333;
          margin-bottom: 8px;
          font-weight: 600;
        }
        
        .welcome-text p {
          color: #666;
          font-size: 16px;
          margin: 0;
        }
        
        .options-container {
          display: flex;
          gap: 25px;
          justify-content: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          animation: ${animationStage === 'entering' ? 'slideUp 0.5s ease 0.3s forwards' : 'none'};
          opacity: ${animationStage === 'initial' ? '0' : '1'};
        }
        
        .option-card {
          flex: 1;
          min-width: 240px;
          max-width: 350px;
          background-color: #fff;
          border-radius: 12px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          position: relative;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          border: 2px solid transparent;
        }
        
        .option-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 12px;
          background: linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        
        .option-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          border-color: rgba(13, 110, 253, 0.3);
        }
        
        .option-card.active {
          transform: translateY(-5px) scale(1.02);
          border-color: #0d6efd;
          box-shadow: 0 20px 30px rgba(13, 110, 253, 0.15);
        }
        
        .option-icon {
          margin-bottom: 20px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(13, 202, 240, 0.1) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .icon-inner {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        
        .option-icon i {
          font-size: 28px;
          color: #0d6efd;
          transition: all 0.3s ease;
        }
        
        .option-card:hover .option-icon {
          transform: scale(1.1);
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.2) 0%, rgba(13, 202, 240, 0.2) 100%);
        }
        
        .option-card.active .option-icon {
          transform: scale(1.1);
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.3) 0%, rgba(13, 202, 240, 0.3) 100%);
        }
        
        .option-card.active .icon-inner {
          background: linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%);
        }
        
        .option-card.active .icon-inner i {
          color: white;
        }
        
        .option-card h4 {
          font-size: 20px;
          margin-bottom: 12px;
          color: #333;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .option-card p {
          color: #666;
          margin-bottom: 20px;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
          text-align: left;
          width: 100%;
        }
        
        .feature-list li {
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          color: #555;
          font-size: 14px;
        }
        
        .feature-list li i {
          color: #0d6efd;
          margin-right: 8px;
          font-size: 12px;
        }
        
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-top: 10px;
          animation: ${animationStage === 'entering' ? 'fadeIn 0.5s ease 0.4s forwards' : 'none'};
          opacity: ${animationStage === 'initial' ? '0' : '1'};
        }
        
        .btn-style1 {
          border: none;
          padding: 12px 25px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        
        .continue-btn {
          min-width: 140px;
        }
        
        .continue-btn.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .continue-btn i {
          transition: transform 0.3s ease;
        }
        
        .continue-btn:hover:not(.disabled) i {
          transform: translateX(3px);
        }
        
        .continue-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            rgba(255,255,255,0) 0%, 
            rgba(255,255,255,0.2) 50%, 
            rgba(255,255,255,0) 100%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        
        .continue-btn:hover:not(.disabled)::before {
          transform: translateX(100%);
        }
        
        .primary {
          background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(13, 110, 253, 0.3);
        }
        
        .primary:hover:not(.disabled) {
          box-shadow: 0 6px 20px rgba(13, 110, 253, 0.4);
          transform: translateY(-2px);
        }
        
        .secondary {
          background: #f8f9fa;
          color: #333;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        
        .secondary:hover {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
          background: #f2f2f2;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @media (max-width: 768px) {
          .options-container {
            flex-direction: column;
            align-items: center;
          }
          
          .option-card {
            width: 100%;
            max-width: 100%;
          }
          
          .modal-container {
            width: 95%;
            max-height: 85vh;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default SignupModal;