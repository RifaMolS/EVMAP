import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SignupModal from './SignupModal';

function Header() {
  const location = useLocation();
  
  const [auth, setAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Function to get auth data from localStorage
  const getAuthFromStorage = () => {
    try {
      const stored = localStorage.getItem('yourstorage');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error parsing localStorage:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const authData = getAuthFromStorage();
    setAuth(authData);
    setIsLoading(false);
  }, []);

  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update auth state on route change with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      const authData = getAuthFromStorage();
      setAuth(authData);
    }, 50); // Small delay to ensure localStorage is updated

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Listen for storage changes (useful for logout from other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'yourstorage') {
        const authData = getAuthFromStorage();
        setAuth(authData);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logo = 'images/logo-inner.png';

  // Show loading state briefly to prevent flash
  if (isLoading) {
    return (
      <header className="header-style1 menu_area-light fixed-top">
        <div className="navbar-default border-bottom border-color-light-white">
          <div className="container-fluid px-lg-1-6 px-xl-2-5 px-xxl-2-9">
            <div className="row align-items-center">
              <div className="col-12 col-lg-12">
                <div className="menu_area alt-font">
                  <nav className="navbar navbar-expand p-0">
                    <div className="navbar-header navbar-header-custom">
                      <Link to="/" className="navbar-brand">
                        <img 
                          id="logo-react" 
                          src={logo} 
                          alt="logo" 
                          className={scrolled ? 'scrolled-logo' : ''} 
                        />
                      </Link>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="header-style1 menu_area-light fixed-top">
        <div className="navbar-default border-bottom border-color-light-white">
          <div className="container-fluid px-lg-1-6 px-xl-2-5 px-xxl-2-9">
            <div className="row align-items-center">
              <div className="col-12 col-lg-12">
                <div className="menu_area alt-font">
                  <nav className="navbar navbar-expand p-0">
                    <div className="navbar-header navbar-header-custom">
                      <Link to="/" className="navbar-brand">
                        <img 
                          id="logo-react" 
                          src={logo} 
                          alt="logo" 
                          className={scrolled ? 'scrolled-logo' : ''} 
                        />
                      </Link>
                    </div>

                    <div className="collapse navbar-collapse show">
                      {!auth ? (
                        // Unauthenticated user menu
                        <>
                          <ul className="navbar-nav ms-auto" id="nav">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/about">About</Link></li>
                          </ul>
                          <div className="attr-nav align-items-xl-center ms-xl-auto main-font">
                            <ul>
                              <li><a href="#"><i className="fas fa-search"></i></a></li>
                              <li><button onClick={openModal} className="btn-style1 medium primary">SignUp</button></li>
                              <li><Link to="/signin" className="btn-style1 medium primary">Signin</Link></li>
                            </ul>
                          </div>
                        </>
                      ) : auth.usertype === 0 ? (
                        // Authenticated user with usertype 0 menu
                        <>
                          <ul className="navbar-nav ms-auto" id="nav">
                            <li><Link to="/station">Station</Link></li>
                            <li><Link to="/slots">Slots</Link></li>
                            <li>
                              <Link to="/profile">Profile</Link>
                              <ul><li><Link to="/trip">Trip Planner</Link></li></ul>
                            </li>
                            <li><Link to="/viewmech">Mechanics</Link></li>
                            <li><Link to="/carcondition">Car Condition</Link></li>
                            <li><Link to="/bookinghistory">Booking History</Link></li>
                            <li><Link to="/complaint">Complaint</Link></li>
                          </ul>
                          <div className="attr-nav align-items-xl-center ms-xl-auto main-font">
                            <ul>
                              <li><a href="#"><i className="fas fa-search"></i></a></li>
                              <li><Link to="/logout" className="btn-style1 medium primary">Logout</Link></li>
                            </ul>
                          </div>
                        </>
                      ) : (
                        // Fallback for other user types - show basic menu
                        <>
                          <ul className="navbar-nav ms-auto" id="nav">
                            <li><Link to="/">Home</Link></li>
                          </ul>
                          <div className="attr-nav align-items-xl-center ms-xl-auto main-font">
                            <ul>
                              <li><Link to="/logout" className="btn-style1 medium primary">Logout</Link></li>
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .navbar-collapse {
            display: flex !important;
            opacity: 1;
            visibility: visible;
            transition: opacity 0.3s ease, visibility 0.3s ease;
          }

           .header-style1 {
   position: fixed;
    top: 0;
   width: 100%;
   z-index: 9999;
        background: ${scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.4)'};
    color: white;
   transition: background 0.3s ease-in-out;
   backdrop-filter: blur(6px);
  }
          .navbar-collapse.collapse {
            display: flex !important;
          }

          .navbar-nav {
            opacity: 1;
            visibility: visible;
            transition: opacity 0.3s ease, visibility 0.3s ease;
          }

          .attr-nav {
            opacity: 1;
            visibility: visible;
            transition: opacity 0.3s ease, visibility 0.3s ease;
          }

          @media (max-width: 991px) {
            .navbar-nav {
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: space-around;
            }

            .navbar-nav > li {
              padding: 0 10px;
            }

            .navbar-nav li ul {
              position: absolute;
              z-index: 999;
            }
          }

          #logo-react {
            height: 50px;
            width: auto;
            display: block;
            object-fit: contain;
            transition: all 0.3s ease;
          }

          .scrolled-logo {
            transform: scale(0.85);
            opacity: 0.8;
          }

          .navbar-header-custom {
            display: flex;
            align-items: center;
          }

          .attr-nav ul {
            display: flex;
            align-items: center;
            gap: 10px;
            list-style: none;
            margin: 0;
            padding: 0;
          }

          .attr-nav li {
            display: flex;
            align-items: center;
          }

          /* Prevent flickering during navigation */
          .navbar-nav, .attr-nav {
            min-height: 40px;
          }
        `}</style>
      </header>
      <SignupModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}

export default Header;


