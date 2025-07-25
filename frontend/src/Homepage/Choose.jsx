import React from 'react'

function Choose() {
  return (
    <div>
              <section className="pt-0">
            <div className="mb-2-9">
                <div className="container">
                    <div className="row align-items-center mt-n2-6">
                        <div className="col-lg-6 mt-2-6">
                            <div>
                                <div className="section-title mb-4">
                                    <span>Why Choose US</span>
                                    <h2>Take Care of Your Car & Our Planet</h2>
                                </div>
                                <p className="w-lg-85 mb-4">Every single electric vehicle, also referred to as battery electric vehicles (BEVs), have an electric engine rather than a gas powered motor. Electric vehicles function by connecting to a charge point and taking power from the grid.</p>
                                <div className="progress-style1 w-md-80">
                                    <div className="progress-text">
                                        <div className="row">
                                            <div className="col-6 fw-bold mb-2">EV Drivers Services</div>
                                            <div className="col-6 text-end">70%</div>
                                        </div>
                                    </div>
                                    <div className="custom-progress progress rounded-3">
                                        <div className="animated custom-bar progress-bar slideInLeft bg-primary" style={{ width: "70%" }} aria-valuemax="100" aria-valuemin="0" aria-valuenow="10" role="progressbar"></div>
                                    </div>
                                    <div className="progress-text">
                                        <div className="row">
                                            <div className="col-6 fw-bold mb-2">Point Services</div>
                                            <div className="col-6 text-end">90%</div>
                                        </div>
                                    </div>
                                    <div className="custom-progress progress rounded-3">
                                        <div className="animated custom-bar progress-bar slideInLeft bg-primary" style={{ width: "90%" }} aria-valuemax="100" aria-valuemin="0" aria-valuenow="10" role="progressbar"></div>
                                    </div>
                                    <div className="progress-text">
                                        <div className="row">
                                            <div className="col-6 fw-bold mb-2">Quality Service</div>
                                            <div className="col-6 text-end">98%</div>
                                        </div>
                                    </div>
                                    <div className="custom-progress progress rounded-3">
                                        <div className="animated custom-bar progress-bar slideInLeft bg-primary" style={{ width: "98%" }} aria-valuemax="100" aria-valuemin="0" aria-valuenow="10" role="progressbar"></div>
                                    </div>
                                    <div className="progress-text">
                                        <div className="row">
                                            <div className="col-6 fw-bold mb-2">DC Charger Services</div>
                                            <div className="col-6 text-end">65%</div>
                                        </div>
                                    </div>
                                    <div className="custom-progress progress rounded-3">
                                        <div className="animated custom-bar progress-bar slideInLeft bg-primary" style={{ width: "65%" }} aria-valuemax="100" aria-valuemin="0" aria-valuenow="10" role="progressbar"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mt-2-6">
                            <div className="bg-dark p-1-9 p-md-5 border-radius-10">
                                <form className="contact quform" action="quform/contact.php" method="post" enctype="multipart/form-data" onclick="">
                                    <div className="quform-elements">
                                        <div className="row">
{/* 
                                            <!-- Begin Text input element --> */}
                                            <div className="col-md-6">
                                                <div className="quform-element form-group">
                                                    <label for="name">Your Name <span className="quform-required">*</span></label>
                                                    <div className="quform-input">
                                                        <input className="form-control" id="name" type="text" name="name" placeholder="Your name here"/>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <!-- End Text input element -->

                                            <!-- Begin Text input element --> */}
                                            <div className="col-md-6">
                                                <div className="quform-element form-group">
                                                    <label for="email">Your Email <span className="quform-required">*</span></label>
                                                    <div className="quform-input">
                                                        <input className="form-control" id="email" type="text" name="email" placeholder="Your email here"/>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <!-- End Text input element -->

                                            <!-- Begin Text input element --> */}
                                            <div className="col-md-6">
                                                <div className="quform-element form-group">
                                                    <label for="subject">Your Subject <span className="quform-required">*</span></label>
                                                    <div className="quform-input">
                                                        <input className="form-control" id="subject" type="text" name="subject" placeholder="Your subject here"/>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <!-- End Text input element -->

                                            <!-- Begin Text input element --> */}
                                            <div className="col-md-6">
                                                <div className="quform-element form-group">
                                                    <label for="phone">Contact Number</label>
                                                    <div className="quform-input">
                                                        <input className="form-control" id="phone" type="text" name="phone" placeholder="Your phone here"/>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <!-- End Text input element -->

                                            <!-- Begin Textarea element --> */}
                                            <div className="col-md-12">
                                                <div className="quform-element form-group">
                                                    <label for="message">Message <span className="quform-required">*</span></label>
                                                    <div className="quform-input">
                                                        <textarea className="form-control" id="message" name="message" rows="3" placeholder="Tell us a few words"></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <!-- End Textarea element -->

                                            <!-- Begin Captcha element --> */}
                                            <div className="col-md-12">
                                                <div className="quform-element">
                                                    <div className="form-group">
                                                        <div className="quform-input">
                                                            <input className="form-control" id="type_the_word" type="text" name="type_the_word" placeholder="Type the below word"/>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="quform-captcha">
                                                            <div className="quform-captcha-inner">
                                                                <img src="images/courier-new-light.png" alt="..."/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <!-- End Captcha element --> */}

                                            {/* <!-- Begin Submit button --> */}
                                            <div className="col-md-12">
                                                <div className="quform-submit-inner">
                                                    <button className="btn-style1 primary border-0" type="submit"><span>Send Message</span></button>
                                                </div>
                                                <div className="quform-loading-wrap text-start"><span className="quform-loading"></span></div>
                                            </div>
                                            {/* <!-- End Submit button --> */}

                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-light testimonial-one border-radius-10">
                <div className="container">
                    <div className="section-title text-center mb-1-6 mb-md-5">
                        <span>Testimonials</span>
                        <h2>Our Clients Says</h2>
                    </div>
                    <div className="row">
                        <div className="testimonial-carousel3 owl-carousel owl-theme">
                            <div className="shadow p-1-6 p-sm-1-9 mx-4 my-4 border-radius-10">
                                <div className="d-flex align-items-center mb-4">
                                    <div>
                                        <img src="images/avatar-01.jpg" className="rounded-circle" alt="..."/>
                                    </div>
                                    <div className="ps-3">
                                        <h4 className="h5 mb-0 text-primary">Eleleta Girma</h4>
                                        <p className="mb-0">Customer</p>
                                    </div>
                                </div>
                                <p className="mb-4 border-bottom pb-4">Charging station is the next killer app. I would be lost without charging station. I will refer everyone i know.</p>
                                <ul className="list-unstyled mb-0">
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                </ul>
                            </div>
                            <div className="shadow p-1-6 p-sm-1-9 mx-4 my-4 border-radius-10">
                                <div className="d-flex align-items-center mb-4">
                                    <div>
                                        <img src="images/avatar-02.jpg" className="rounded-circle" alt="..."/>
                                    </div>
                                    <div className="ps-3">
                                        <h4 className="h5 mb-0 text-primary">Efrem Yonas</h4>
                                        <p className="mb-0">Customer</p>
                                    </div>
                                </div>
                                <p className="mb-4 border-bottom pb-4">I am completely blown away. We've used charging station for the last five years. I'm good to go.</p>
                                <ul className="list-unstyled mb-0">
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                </ul>
                            </div>
                            <div className="shadow p-1-6 p-sm-1-9 mx-4 my-4 border-radius-10">
                                <div className="d-flex align-items-center mb-4">
                                    <div>
                                        <img src="images/avatar-03.jpg" className="rounded-circle" alt="..."/>
                                    </div>
                                    <div className="ps-3">
                                        <h4 className="h5 mb-0 text-primary">Ariam Kifle</h4>
                                        <p className="mb-0">Customer</p>
                                    </div>
                                </div>
                                <p className="mb-4 border-bottom pb-4">Charging station impressed me on multiple levels. Charging station is the next killer app.</p>
                                <ul className="list-unstyled mb-0">
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                </ul>
                            </div>
                            <div className="shadow p-1-6 p-sm-1-9 mx-4 my-4 border-radius-10">
                                <div className="d-flex align-items-center mb-4">
                                    <div>
                                        <img src="images/avatar-04.jpg" className="rounded-circle" alt="..."/>
                                    </div>
                                    <div className="ps-3">
                                        <h4 className="h5 mb-0 text-primary">Gebre Demsas</h4>
                                        <p className="mb-0">Customer</p>
                                    </div>
                                </div>
                                <p className="mb-4 border-bottom pb-4">I just can't get enough of charging station. I am really satisfied with my charging station.</p>
                                <ul className="list-unstyled mb-0">
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                    <li className="d-inline-block"><i className="fa-solid fa-star text-block-opacity"></i></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Choose
