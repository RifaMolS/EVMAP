import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { useLocation } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/effect-fade';
import { Link } from 'react-router-dom';

import Features from './Features';
import About from './About';
import Services from './Services';
import Counter from './Counter';
import Action from './Action';
import Footer from './Footer';
import Gallery from './Gallery';
import Header from './Header';
import Contact from './Contact';
import Aboutus from './Aboutus';
import Chatbot from './Chatbot';

function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const swiperRef = useRef(null);
  const location = useLocation();
  
  useEffect(() => {
    // Check login status (adjust key as needed)
    const user = localStorage.getItem("yourstorage");
    setIsLoggedIn(!!user);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("reload") === "true") {
      sessionStorage.removeItem("reload");
      window.location.reload();
    }
  }, []);

  // Handle Swiper initialization properly
  const handleSwiperInit = (swiper) => {
    // Single update call with proper timing
    requestAnimationFrame(() => {
      swiper.update();
      swiper.updateSize();
      swiper.updateSlides();
    });
  };

  // Loading state to prevent flash of content
  if (isLoading) {
    return (
      <div>
        <Header />
        <div style={{ 
          height: '100vh', 
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <section className="full-screen top-position1 p-0 banner-03" style={{ position: 'relative', overflow: 'hidden' }}>
        <Swiper
          ref={swiperRef}
          modules={[Autoplay, EffectFade]}
          loop={true}
          autoplay={{ 
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false
          }}
          effect="fade"
          fadeEffect={{
            crossFade: true
          }}
          className="w-100 min-vh-100"
          onSwiper={handleSwiperInit}
          style={{ width: '100%', height: '100vh' }}
          // Add these props to ensure proper initialization
          watchSlidesProgress={true}
          watchOverflow={true}
        >
          <SwiperSlide>
            <div
              className="item bg-img cover-background"
              style={{ 
                backgroundImage: "url('img/banner/banner-01.jpg')",
                height: '100vh',
                width: '100%',
                position: 'relative',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="container pt-sm-6 pt-md-0 d-flex flex-column" style={{ height: '100%' }}>
                <div className="row align-items-center justify-content-end text-end min-vh-100 pt-6 pt-md-0">
                  <div className="col-lg-10 mb-1-9 mb-lg-0 py-5">
                    <div 
                      className="title-style1 text-primary h4" 
                      style={{ 
                        fontSize: '1.25rem', 
                        marginBottom: '1rem',
                        opacity: 1,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    >
                      <span>For Every Electric Vehicle!</span>
                    </div>
                    <h1 
                      className="text-white mb-4" 
                      style={{ 
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
                        lineHeight: '1.2',
                        fontWeight: 'bold',
                        marginBottom: '2rem',
                        opacity: 1,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    >
                      For Large & Small Charging Stations
                    </h1>
                    <Link
                      to={isLoggedIn ? "/slots" : "/about"}
                      className="btn-style1 primary"
                      style={{ 
                        display: 'inline-block',
                        padding: '12px 30px',
                        fontSize: '1rem',
                        textDecoration: 'none',
                        opacity: 1,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    >
                      <span>LEARN MORE</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div
              className="item bg-img cover-background"
              style={{ 
                backgroundImage: "url('img/banner/banner-02.jpg')",
                height: '100vh',
                width: '100%',
                position: 'relative',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="container pt-sm-6 pt-md-0 d-flex flex-column" style={{ height: '100%' }}>
                <div className="row align-items-center justify-content-end text-end min-vh-100 pt-6 pt-md-0">
                  <div className="col-lg-10 mb-1-9 mb-lg-0 py-5">
                    <div 
                      className="title-style1 text-primary h4" 
                      style={{ 
                        fontSize: '1.25rem', 
                        marginBottom: '1rem',
                        opacity: 1,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    >
                      <span>For Every Electric Vehicle!</span>
                    </div>
                    <h1 
                      className="text-white mb-4" 
                      style={{ 
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
                        lineHeight: '1.2',
                        fontWeight: 'bold',
                        marginBottom: '2rem',
                        opacity: 1,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    >
                      Solutions For Smart Electric Car Charging!
                    </h1>
                    <Link
                      to={isLoggedIn ? "/slots" : "/about"}
                      className="btn-style1 primary"
                      style={{ 
                        display: 'inline-block',
                        padding: '12px 30px',
                        fontSize: '1rem',
                        textDecoration: 'none',
                        opacity: 1,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    >
                      <span>Learn More</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div
              className="item bg-img cover-background"
              style={{ 
                backgroundImage: "url('img/banner/banner-03.jpg')",
                height: '100vh',
                width: '100%',
                position: 'relative',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="container pt-sm-6 pt-md-0 d-flex flex-column" style={{ height: '100%' }}>
                <div className="row align-items-center justify-content-end text-end min-vh-100 pt-6 pt-md-0">
                  <div className="col-lg-10 mb-1-9 mb-lg-0 py-5">
                    <div 
                      className="title-style1 text-primary h4" 
                      style={{ 
                        fontSize: '1.25rem', 
                        marginBottom: '1rem',
                        opacity: 1,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    >
                      <span>For Every Electric Vehicle!</span>
                    </div>
                    <h1 
                      className="text-white mb-4" 
                      style={{ 
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
                        lineHeight: '1.2',
                        fontWeight: 'bold',
                        marginBottom: '2rem',
                        opacity: 1,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    >
                      Paving The Way For EV Adoption.
                    </h1>
                    <Link
                      to={isLoggedIn ? "/slots" : "/about"}
                      className="btn-style1 primary"
                      style={{ 
                        display: 'inline-block',
                        padding: '12px 30px',
                        fontSize: '1rem',
                        textDecoration: 'none',
                        opacity: 1,
                        transition: 'opacity 0.3s ease-in-out'
                      }}
                    >
                      <span>Learn More</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        <div style={{ height: '80px' }}></div>
      </section>

      <Features />
      <About />
      <Services />
      <Counter />
      <Gallery />
      <Action />
      <Footer />
      <Chatbot />
    </div>
  );
}

export default Main;