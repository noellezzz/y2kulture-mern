import React from 'react'
import './styles/Shared.css'
import LoginModal from '../components/LoginModal'

const Welcome = () => {
  return (
    <>
     <section className="hero-section">
      <div className="content-container dual-main__content">
        <div className="hero-tagline dual-main__container">
          <div className="tagline-title">
            <span className="highlight">Y2Kulture:</span>
          </div>
          <div className="tagline-body">
            a haven for y2k and retro fashionistas
          </div>
        </div>
        <div className="hero-images">
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