import React from 'react'
import './styles/Shared.css'

const Welcome = () => {
  return (
    <>
        <section className='hero-section'>
          <div className="content-container dual-main__content">
            <div className="hero-tagline dual-main__container">
              <div className="tagline-title">
                Y2Kulture:
              </div>
              <div className="tagline-body">
                a haven for Y2K and Retro Lovers
              </div>
            </div>
            <div className="center-img dual-main__container">
              <div className="hero-img__container ">
                <img src="" alt="" />
              </div>
            </div>
          </div>
        </section>

        <section className='carousel-shop'>
          <div className="content-container">
            <div className="shop-container">
              <div className="product-tile"></div>
              <div className="product-tile"></div>
              <div className="product-tile"></div>
              <div className="product-tile"></div>
              <div className="product-tile"></div>
              <div className="product-tile"></div>
              <div className="product-tile"></div>
              <div className="product-tile"></div>
              <div className="product-tile"></div>
              <div className="product-tile"></div>
            </div>
          </div>
        </section>
    </>

  )
}

export default Welcome