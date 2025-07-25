import React from 'react'
// import Header from './Header'
import Footer from './Footer'

function About() {
  return (
    <div>
        {/* <section>
            <div className='bg-color white'></div>
        </section> */}
              <section className="aboutus pt-0">
            <div className="container">
                <div className="row align-items-center mt-n2-6">
                    <div className="col-lg-6 mt-2-6">
                        <div className="position-relative text-center">
                            <img src="images/about-01.jpg" alt="..." className="border-radius-10"/>
                            <div className="img-2">
                                <img src="images/about-02.jpg" alt="..." className="shadow ani-top-bottom"/>
                            </div>
                            <div className="exp-box ani-left-right">
                                <h4 className="mb-0 display-12 text-primary">35+</h4>
                                <span className="text-start ps-3">Years Of Experience</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 mt-2-6">
                        <div className="about-right ps-lg-2-9 ps-xxl-7">
                            <div className="section-title mb-1-9">
                                <span>About Chargey</span>
                                <h2>Professional Electric Vehicle Charging Solution For You</h2>
                            </div>
                            <div className="d-flex mb-1">
                                <div className="lg-text">C</div>
                                <p className="mb-0">Every single electric vehicle, also referred to as battery electric vehicles (BEVs), have an electric engine rather than a gas powered motor.</p>
                            </div>
                            <p>Electric vehicles function by connecting to a charge point and taking power from the grid.</p>
                            <p className="text-primary font-weight-800 fst-italic mb-1-6 mb-sm-5">Electric vehicles speed up quicker than vehicles with conventional fuel motors - so they feel lighter to drive.</p>
                            <div className="d-sm-flex">
                                <div className="mb-1-6 mb-sm-0">
                                    <a href="about.html" className="btn-style1">Read More</a>
                                </div>
                                <div className="d-flex ms-sm-1-6 ms-xl-2-9">
                                    <div>
                                        <i className="ti-headphone-alt display-10 text-primary"></i>
                                    </div>
                                    <div className="ps-3">
                                        <span className="font-weight-900 text-dark">Any Quary ?</span>
                                        <h6 className="mb-0">(+44) 123 456 789</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default About


