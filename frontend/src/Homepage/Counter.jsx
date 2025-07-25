import React from 'react'

function Counter() {
  return (
    <div>
              <section className="py-0">
            <div className="container">
                <div className="bg-img cover-background py-10 py-xl-15" style={{ backgroundImage: "url('img/content/map-bg.jpg')" }}>
                    <div className="row align-items-center mt-n1-6">
                        <div className="col-lg-3 mt-1-6">
                            <div className="row">
                                <div className="col-6 col-lg-12">
                                    <div className="text-center mb-lg-10">
                                        <h3 className="display-18 display-md-15 display-lg-10"><span className="countup">395</span>+</h3>
                                        <span className="fw-bold text-uppercase display-31 display-sm-29">Electric Vehicles</span>
                                    </div>
                                </div>
                                <div className="col-6 col-lg-12">
                                    <div className="text-center">
                                        <h3 className="display-18 display-md-15 display-lg-10"><span className="countup">1872</span>+</h3>
                                        <span className="fw-bold text-uppercase display-31 display-sm-29">Happy Clients</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mt-1-6">
                            <div className="text-center">
                                <img src="images/counter-img.png" alt="..."/>
                            </div>
                        </div>
                        <div className="col-lg-3 mt-1-6">
                            <div className="row">
                                <div className="col-6 col-lg-12">
                                    <div className="text-center mb-lg-10">
                                        <h3 className="display-18 display-md-15 display-lg-10"><span className="countup">850</span>m</h3>
                                        <span className="fw-bold text-uppercase display-31 display-sm-29">Green kms driven</span>
                                    </div>
                                </div>
                                <div className="col-6 col-lg-12">
                                    <div className="text-center">
                                        <h3 className="display-18 display-md-15 display-lg-10"><span className="countup">662</span>+</h3>
                                        <span className="fw-bold text-uppercase display-31 display-sm-29">Service Stations</span>
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

export default Counter
