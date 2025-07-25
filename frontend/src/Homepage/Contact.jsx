import React from 'react'
import Header from './Header'
import Footer from './Footer'

function Contact() {
  return (
    <div>
        <Header/>
            <section className="page-title-section bg-img cover-background top-position1 secondary-overlay overflow-visible" data-overlay-dark="7" style={{ backgroundImage: "url('img/banner/page-title.jpg')" }}>
            <div className="container">
                <div className="row" style={{ marginTop: "100px" }}>
                    <div className="col-md-12">
                        <div className="position-relative text-center">
                            <h1>Contact Us</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sub-title">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="">Contact Us</a></li>
                </ul>
            </div>
        </section>

        <section>
            <div className="container">
                <div className="col-lg-8 mx-auto">
                    <div className="shadow p-1-6 p-sm-1-9 p-lg-2-9 border-radius-10">
                        <div className="section-title text-center mb-1-6 mb-md-5">
                            <span>Contact us</span>
                            <h2>Drop Us a Line</h2>
                        </div>
                        <form className="contact quform" action="quform/contact.php" method="post" enctype="multipart/form-data" onclick="">
                            <div className="quform-elements">
                                <div className="row">

                                    {/* <!-- Begin Text input element --> */}
                                    <div className="col-md-6">
                                        <div className="quform-element form-group">
                                            <label for="name">Your Name <span className="quform-required">*</span></label>
                                            <div className="quform-input">
                                                <input className="form-control" id="name" type="text" name="name" placeholder="Your name here" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- End Text input element --> */}

                                    {/* <!-- Begin Text input element --> */}
                                    <div className="col-md-6">
                                        <div className="quform-element form-group">
                                            <label for="email">Your Email <span className="quform-required">*</span></label>
                                            <div className="quform-input">
                                                <input className="form-control" id="email" type="text" name="email" placeholder="Your email here" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- End Text input element --> */}

                                    {/* <!-- Begin Text input element --> */}
                                    <div className="col-md-6">
                                        <div className="quform-element form-group">
                                            <label for="subject">Your Subject <span className="quform-required">*</span></label>
                                            <div className="quform-input">
                                                <input className="form-control" id="subject" type="text" name="subject" placeholder="Your subject here" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- End Text input element --> */}

                                    {/* <!-- Begin Text input element --> */}
                                    <div className="col-md-6">
                                        <div className="quform-element form-group">
                                            <label for="phone">Contact Number</label>
                                            <div className="quform-input">
                                                <input className="form-control" id="phone" type="text" name="phone" placeholder="Your phone here" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- End Text input element --> */}

                                    {/* <!-- Begin Textarea element --> */}
                                    <div className="col-md-12">
                                        <div className="quform-element form-group">
                                            <label for="message">Message <span className="quform-required">*</span></label>
                                            <div className="quform-input">
                                                <textarea className="form-control" id="message" name="message" rows="3" placeholder="Tell us a few words"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- End Textarea element --> */}

                                    {/* <!-- Begin Captcha element --> */}
                                    <div className="col-md-12">
                                        <div className="quform-element">
                                            <div className="form-group">
                                                <div className="quform-input">
                                                    <input className="form-control" id="type_the_word" type="text" name="type_the_word" placeholder="Type the below word" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <div className="quform-captcha">
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- End Captcha element --> */}

                                    {/* <!-- Begin Submit button --> */}
                                    <div className="col-md-12">
                                        <div className="quform-submit-inner">
                                            <button className="btn-style1 border-0 medium" type="submit">Send Message</button>
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
        </section>

        <section className="contact-data py-0">
            <div className="container-fuild">
                <div className="row g-md-4">
                    <div className="col-md-6 col-lg-7 col-xl-8 col-xxl-9 order-2 order-md-1">
                        <div className="contact-map">
                            <iframe className="contact-map" id="gmap_canvas" src="https://maps.google.com/maps?q=Logiprompt%20Techno%20Solutions%20India%20Pvt%20Ltd,%20Trivandrum&t=&z=15&ie=UTF8&iwloc=&output=embed"></iframe>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-5 col-xl-4 col-xxl-3 order-1 order-md-2">
                        <div className="bg-img cover-background contact-inner d-table h-100 w-100" data-overlay-dark="5" style={{ backgroundImage: "url('img/content/contact-img.jpg')" }}>
                            <div className="d-table-cell align-middle h-100">
                                <div className="section-title contact-title mb-1-9 position-relative z-index-9">
                                    <h2 className="text-white">Get In Touch</h2>
                                </div>
                                <div className="d-flex position-relative z-index-9 mb-1-9">
                                    <div className="flex-shrink-0 pt-2">
                                        <i className="ti-mobile text-primary display-20"></i>
                                    </div>
                                    <div className="flex-grow-1 ps-4">
                                        <p className="mb-0 text-white">(+44) 123 456 789</p>
                                        <p className="mb-0 text-white">(+44) 152-567-987</p>
                                    </div>
                                </div>
                                <div className="d-flex position-relative z-index-9 mb-1-9">
                                    <div className="flex-shrink-0 pt-2">
                                        <i className="ti-location-pin text-primary display-20"></i>
                                    </div>
                                    <div className="flex-grow-1 ps-4">
                                        <p className="mb-0 text-white w-sm-40 w-md-100">66 Guild Street 512B, Great North Town.</p>
                                    </div>
                                </div>
                                <div className="d-flex position-relative z-index-9">
                                    <div className="flex-shrink-0 pt-2">
                                        <i className="ti-email text-primary display-20"></i>
                                    </div>
                                    <div className="flex-grow-1 ps-4">
                                        <p className="mb-0 text-white">info@example.com</p>
                                        <p className="mb-0 text-white">info@domain.com</p>
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

export default Contact