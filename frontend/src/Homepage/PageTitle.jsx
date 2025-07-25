import React from 'react'

function PageTitle() {
  return (
    <div>
              <section className="page-title-section bg-img cover-background top-position1 secondary-overlay overflow-visible" data-overlay-dark="7" style={{ backgroundImage: "url('img/banner/banner-01.jpg')" }}>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="position-relative text-center">
                            <h1>Public Stations</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sub-title">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="#">Public Stations</a></li>
                </ul>
            </div>
        </section>
    </div>
  )
}

export default PageTitle
