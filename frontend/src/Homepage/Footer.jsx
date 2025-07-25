import React from 'react'

function Footer() {
  return (
    <div>
              <footer className="position-relative">
            <div className="container">
                <div className="row mt-n1-9">
                    <div className="col-sm-6 col-lg-4 mt-1-9">
                        <div className="pe-sm-5">
                            <div className="section-title footer mb-1-6 mb-md-1-9">
                                <span>About Company</span>
                            </div>
                            <p className="mb-1-9 display-27 text-white opacity9 lh-base">Electric vehicles function by connecting to a charge point and taking power from the grid.</p>
                            <ul className="social-icon-style1">
                                <li>
                                    <a href="#!"><i className="fab fa-facebook-f"></i></a>
                                </li>
                                <li>
                                    <a href="#!"><i className="fab fa-twitter"></i></a>
                                </li>
                                <li>
                                    <a href="#!"><i className="fab fa-youtube"></i></a>
                                </li>
                                <li>
                                    <a href="#!"><i className="fab fa-linkedin-in"></i></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-sm-6 col-lg-2 mt-1-9">
                        <div className="ps-sm-5 ps-lg-0">
                            <div className="section-title footer mb-1-6 mb-md-1-9">
                                <span>Quick Links</span>
                            </div>
                            <ul className="list-unstyled mb-0 list-style1">
                                <li><a href="about.html">About</a></li>
                                <li><a href="our-history.html">History</a></li>
                                <li><a href="pricing.html">Pricing</a></li>
                                <li><a href="team.html">Team</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-sm-6 col-lg-3 mt-1-9">
                        <div className="ps-lg-4 ps-xl-0 pe-sm-1-6 pe-xl-5">
                            <div className="section-title footer mb-1-6 mb-md-1-9">
                                <span>Contacts</span>
                            </div>
                            <ul className="footer-link mb-0 list-unstyled">
                                <li className="text-white mb-4">
                                    <strong>Adress:</strong> <span className="opacity8">66 Guild Street 512B, Great North Town.</span>
                                </li>
                                <li className="text-white mb-4">
                                    <strong>Email:</strong> <span className="opacity8">info@example.com</span>
                                </li>
                                <li className="text-white">
                                    <strong>Phone:</strong> <span className="opacity8">(+44) 123 456 789</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-sm-6 col-lg-3 mt-1-9">
                        <div className="ps-sm-5 ps-lg-0">
                            <div className="section-title footer mb-1-6 mb-md-1-9">
                                <span>Newsletter</span>
                            </div>
                            <p className="display-28 text-white">Subscribe For The Our Latest Updates !</p>
                            <form className="quform newsletter-form" action="quform/newsletter-two.php" method="post" enctype="multipart/form-data" onclick="">

                                <div className="quform-elements">
                                    <div className="row">

                                        {/* <!-- Begin Text input element --> */}
                                        <div className="col-md-12">
                                            <div className="quform-element mb-0">
                                                <div className="quform-input mb-3">
                                                    <input className="form-control w-70 w-sm-100" id="email_address" type="text" name="email_address" placeholder="Subscribe with us"/>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <!-- End Text input element --> */}

                                        {/* <!-- Begin Submit button --> */}
                                        <div className="col-md-12">
                                            <div className="quform-submit-inner">
                                                <button className="btn-style1 primary border-0 w-70 w-sm-100" type="submit">Subscribe</button>
                                            </div>
                                            <div className="quform-loading-wrap"><span className="quform-loading"></span></div>
                                        </div>
                                        {/* <!-- End Submit button --> */}
                                    </div>

                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-4 border-top border-color-light-white mt-8">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12 text-center">
                            <p className="d-inline-block text-white mb-0">� <span className="current-year"></span> Chargey Powered by <a href="#!" className="text-primary text-white-hover">Chitrakoot Web</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>
  )
}

export default Footer
