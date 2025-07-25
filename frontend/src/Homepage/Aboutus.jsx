import React from 'react'
import About from './About'
import Footer from './Footer'
import Header from './Header'

function Aboutus() {
  return (
    <div>
        <Header/>
        
        <section className="page-title-section bg-img cover-background top-position1 secondary-overlay overflow-visible" data-overlay-dark="7" style={{ backgroundImage: "url('img/banner/page-title.jpg')" }}>
            <div className="container">
                <div className="row" style={{marginTop:"100px"}}>
                    <div className="col-md-12">
                        <div className="position-relative text-center">
                            <h1>About Us</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sub-title">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="">About Us</a></li>
                </ul>
            </div>
        </section>
        <section>
            <div className='bg-color white'></div>
        </section>
        <About/>
        <Footer/>
    </div>
  )
}

export default Aboutus