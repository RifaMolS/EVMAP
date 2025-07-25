import React from 'react'
import Header from './Header'
import PageTitle from './PageTitle'
import Footer from './Footer'

function PublicStation() {
  return (
    <div>
      <Header/>
      <PageTitle/>
      <section>
            <div className="container">
                <div className="row mt-n1-9">
                    <div className="col-lg-4 mt-1-9 order-2 order-lg-1">
                        <div className="sidebar me-xxl-1-9">
                            <div className="widget bg-secondary mb-1-9 border-radius-10">
                                <div className="widget-content">
                                    <div className="section-title mb-2">
                                        <span>Main Services</span>
                                    </div>
                                    <ul className="category-list list-unstyled mb-0">
                                        <li className="active"><a href="public-stations.html"><span>Public Stations</span></a></li>
                                        <li><a href="solar-clean-energy.html"><span>Solar & Clean Energy</span></a></li>
                                        <li><a href="commercial-systems.html"><span>Commercial Systems</span></a></li>
                                        <li><a href="charge-point-stations.html"><span>Charge Point Stations</span></a></li>
                                        <li><a href="home-charging.html"><span>Home Charging</span></a></li>
                                        <li><a href="dc-charger-service.html"><span>DC Charger Service</span></a></li>
                                        <li><a href="corporate-business.html"><span>Corporate Business</span></a></li>
                                        <li><a href="hybrid-car-watches.html"><span>Hybrid Car Watches</span></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="widget bg-secondary mb-1-9 border-radius-10">
                                <div className="widget-content">
                                    <div className="section-title mb-2">
                                        <span>Brochures</span>
                                    </div>
                                    <ul className="list-unstyled mb-0 btn-wrapper">
                                        <li>
                                            <a href="#!"><i className="ti-harddrives icon"></i>Download PDF</a>
                                        </li>
                                        <li>
                                            <a href="#!"><i className="ti-write icon"></i>Download Doc.</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="widget bg-secondary mb-1-9 border-radius-10">
                                <div className="widget-content">
                                    <div className="section-title mb-2">
                                        <span>Follow Us</span>
                                    </div>
                                    <ul className="social-icon-style1">
                                        <li><a href="#!"><i className="fab fa-facebook-f"></i></a></li>
                                        <li><a href="#!"><i className="fab fa-twitter"></i></a></li>
                                        <li><a href="#!"><i className="fab fa-instagram"></i></a></li>
                                        <li><a href="#!"><i className="fab fa-linkedin-in"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="widget border-radius-10 bg-img cover-background primary-overlay" data-overlay-dark="9" style={{ backgroundImage: "url('img/bg/bg-03.jpg')" }}>
                                <div className="widget-content help-box text-center">
                                    <i className="fa-solid fa-headset position-relative z-index-9 text-white mb-4 display-14"></i>
                                    <div className="section-title large-title mb-2">
                                        <span className="text-secondary position-relative z-index-9">Have Any Question ?</span>
                                    </div>
                                    <ul className="position-relative z-index-9 list-unstyled mb-0">
                                        <li className="mb-3"><a href="#!" className="text-white"><i className="fa-solid fa-phone pe-3"></i>(+44) 123 456 789</a></li>
                                        <li><a href="#!" className="text-white"><i className="fa-regular fa-envelope pe-3"></i>info@example.com</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8 mt-1-9 order-1 order-lg-2">
                        <div>
                            <div className="service-details-img position-relative mb-1-9">
                                <img src="img/service/service-details-01.jpg" alt="..." className="border-radius-10"/>
                            </div>
                            <div className="section-title md mb-3">
                                <h2>Public Stations</h2>
                            </div>
                            <p className="mb-1-6">An electric powered car charging station is gadget that connects an electric powered car (EV) to a supply of strength to recharge electric powered cars, community electric powered motors and plug-in hybrids. Some charging stations have superior functions inclusive of smart metering, mobile functionality and community connectivity, even as others are greater basic.</p>
                            <div className="row mb-1-6 mt-n4">
                                <div className="col-md-6 mt-4">
                                    <div>
                                        <div className="section-title sm mb-3">
                                            <h2 className="display-30">Included Services</h2>
                                        </div>
                                        <ul className="list-unstyled mb-0">
                                            <li className="mb-2"><i className="ti-check text-primary me-3"></i>Charge Point Setting</li>
                                            <li className="mb-2"><i className="ti-check text-primary me-3"></i>Home Charging</li>
                                            <li className="mb-2"><i className="ti-check text-primary me-3"></i>Public Charging</li>
                                            <li><i className="ti-check text-primary me-3"></i>Fully Carefull & Safety Guard</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-6 mt-4">
                                    <div>
                                        <div className="section-title sm mb-3">
                                            <h2>Benifits of Services</h2>
                                        </div>
                                        <ul className="list-unstyled mb-0">
                                            <li className="mb-2"><i className="ti-check text-primary me-3"></i>No Hidden Charges</li>
                                            <li className="mb-2"><i className="ti-check text-primary me-3"></i>Hardware Warranty</li>
                                            <li className="mb-2"><i className="ti-check text-primary me-3"></i>24/7 Support</li>
                                            <li><i className="ti-check text-primary me-3"></i>Quality Standards</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <p className="mb-1-9">Charging stations also are referred to as electric powered car deliver gadget (EVSE) and are furnished in municipal parking places via way of means of electric powered application groups or at retail purchasing facilities via way of means of non-public groups. These stations offer unique connectors that agree to the sort of electric powered charging connector standards.</p>
                            <div className="mt-2-3">
                                <div id="accordion" className="accordion-style">
                                    <div className="card mb-3">
                                        <div className="card-header" id="headingOne">
                                            <h5 className="mb-0">
                                                <button className="btn btn-link" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">1. How do i use a promotional code ?</button>
                                            </h5>
                                        </div>
                                        <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-bs-parent="#accordion">
                                            <div className="card-body">
                                                <div className="d-flex align-items-start">
                                                    <img src="img/content/faq-01.jpg" alt="..." className="border-radius-10 d-none d-sm-block"/>
                                                    <div className="ps-sm-3">
                                                        The common charging time for an electric powered automobile can variety from half-hour and as much as extra than 12 hours. This all relies upon on the velocity of the charging station and the scale of the battery.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card mb-3">
                                        <div className="card-header" id="headingTwo">
                                            <h5 className="mb-0">
                                                <button className="btn btn-link collapsed" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">2. What are the different services offers ?</button>
                                            </h5>
                                        </div>
                                        <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-bs-parent="#accordion">
                                            <div className="card-body">
                                                <div className="d-flex align-items-start">
                                                    <img src="img/content/faq-02.jpg" alt="..." className="border-radius-10 d-none d-sm-block"/>
                                                    <div className="ps-sm-3">
                                                        The common charging time for an electric powered automobile can variety from half-hour and as much as extra than 12 hours. This all relies upon on the velocity of the charging station and the scale of the battery.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card mb-3">
                                        <div className="card-header" id="headingThree">
                                            <h5 className="mb-0">
                                                <button className="btn btn-link collapsed" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">3. How do you calculate the power consumption of an electric car ?</button>
                                            </h5>
                                        </div>
                                        <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-bs-parent="#accordion">
                                            <div className="card-body">
                                                <div className="d-flex align-items-start">
                                                    <img src="img/content/faq-03.jpg" alt="..." className="border-radius-10 d-none d-sm-block"/>
                                                    <div className="ps-sm-3">
                                                        The common charging time for an electric powered automobile can variety from half-hour and as much as extra than 12 hours. This all relies upon on the velocity of the charging station and the scale of the battery.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card mb-3 mb-lg-0">
                                        <div className="card-header" id="headingFour">
                                            <h5 className="mb-0">
                                                <button className="btn btn-link collapsed" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">4. How much does it cost to fully charge an electric car ?</button>
                                            </h5>
                                        </div>
                                        <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-bs-parent="#accordion">
                                            <div className="card-body">
                                                <div className="d-flex align-items-start">
                                                    <img src="img/content/faq-04.jpg" alt="..." className="border-radius-10 d-none d-sm-block"/>
                                                    <div className="ps-sm-3">
                                                        The common charging time for an electric powered automobile can variety from half-hour and as much as extra than 12 hours. This all relies upon on the velocity of the charging station and the scale of the battery.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card mb-3">
                                        <div className="card-header" id="headingFive">
                                            <h5 className="mb-0">
                                                <button className="btn btn-link collapsed" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">5. Where can i find the nearest charging station ?</button>
                                            </h5>
                                        </div>
                                        <div id="collapseFive" className="collapse" aria-labelledby="headingFive" data-bs-parent="#accordion">
                                            <div className="card-body">
                                                <div className="d-flex align-items-start">
                                                    <img src="img/content/faq-05.jpg" alt="..." className="border-radius-10 d-none d-sm-block"/>
                                                    <div className="ps-sm-3">
                                                        The common charging time for an electric powered automobile can variety from half-hour and as much as extra than 12 hours. This all relies upon on the velocity of the charging station and the scale of the battery.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Footer/>
    </div>
  )
}

export default PublicStation
