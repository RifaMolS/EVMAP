import React from 'react'

function Services() {
  return (
    <div>
              <section className="bg-dark">
            <div className="container">
                <div className="row align-items-center mb-5 mt-n1-9">
                    <div className="col-lg-6 mt-1-9">
                        <div className="section-title text-center text-lg-start">
                            <span>Our Services</span>
                            <h2 className="text-white">Best Charging Services For Your EV</h2>
                        </div>
                    </div>
                    <div className="col-lg-6 mt-1-9">
                        <div className="text-center text-lg-end">
                            <p className="mb-0 text-white">Every single electric vehicle, also referred to as battery electric vehicles (BEVs), have an electric engine rather than a gas powered motor. Electric vehicles function by connecting to a charge point and taking power from the grid.</p>
                        </div>
                    </div>
                </div>
                <div className="row g-5">
                    <div className="col-md-6 col-xl-3">
                        <div className="card card-style02 border-0 bg-transparent">
                            <img src="images/service-01.jpg" alt="..." className="border-radius-10"/>
                            <div className="card-body px-0 position-relative">
                                <h3 className="text-primary h6">Public Stations</h3>
                                <p className="text-white mb-0">We focus on the best practices for all solutions and services.</p>
                                <div className="plus-icon">
                                    <a href="public-stations.html"><i className="ti-plus"></i></a>
                                </div>
                                <div className="btn-text">
                                    <a href="public-stations.html">Read More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-3">
                        <div className="card card-style02 border-0 bg-transparent">
                            <img src="images/service-02.jpg" alt="..." className="border-radius-10"/>
                            <div className="card-body px-0 position-relative">
                                <h3 className="text-primary h6">Solar & Clean Energy</h3>
                                <p className="text-white mb-0">We focus on the best practices for all solutions and services.</p>
                                <div className="plus-icon">
                                    <a href="solar-clean-energy.html"><i className="ti-plus"></i></a>
                                </div>
                                <div className="btn-text">
                                    <a href="solar-clean-energy.html">Read More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-3">
                        <div className="card card-style02 border-0 bg-transparent">
                            <img src="images/service-03.jpg" alt="..." className="border-radius-10"/>
                            <div className="card-body px-0 position-relative">
                                <h3 className="text-primary h6">Commercial Systems</h3>
                                <p className="text-white mb-0">We focus on the best practices for all solutions and services.</p>
                                <div className="plus-icon">
                                    <a href="commercial-systems.html"><i className="ti-plus"></i></a>
                                </div>
                                <div className="btn-text">
                                    <a href="commercial-systems.html">Read More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-3">
                        <div className="card card-style02 border-0 bg-transparent">
                            <img src="images/service-04.jpg" alt="..." className="border-radius-10"/>
                            <div className="card-body px-0 position-relative">
                                <h3 className="text-primary h6">Charge Point Stations</h3>
                                <p className="text-white mb-0">We focus on the best practices for all solutions and services.</p>
                                <div className="plus-icon">
                                    <a href="charge-point-stations.html"><i className="ti-plus"></i></a>
                                </div>
                                <div className="btn-text">
                                    <a href="charge-point-stations.html">Read More</a>
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

export default Services
