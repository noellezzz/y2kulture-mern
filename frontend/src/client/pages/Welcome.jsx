import React from 'react'
import './styles/Shared.css'
import LoginModal from '../components/LoginModal'
import heroImage from '../../assets/heroimage.png'

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
              A Haven for Y2k and Retro Fashionistas
            </div>
          </div>
          <div className="hero-images">
            <img src={heroImage} alt="" />
          </div>
        </div>
      </section>
      <section className='light-section'>
        <div className="section-header">
          <div className="section-texts">
            <div className="section-header__title">Top Grossing Products</div>
            <div className="section-sub__header">Discover your unique style today!</div>
          </div>
          <div className="section-categories">
            <button className="prime-button">Men's Wear</button>
            <button className="prime-button">Women's Wear</button>
            <button className="prime-button">Trending</button>
          </div>
        </div>
        <div className="store-primary">
          <div className="product-tile__primary">
            <div className="tile-img__container">
              <div className="product-badge">New</div>
              <img src="https://placehold.co/200x800" alt="Product" />
            </div>
            <div className="tile-body__container">
              <div className="product-title">Sample Title</div>
              <div className="product-category">Sample Category</div>
              <div className="product-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
              <div className="tile-controls">
                <div className="product-price">Price: $ 9.99</div>
                <button className="prime-button tile-button">Add to Cart</button>
              </div>
            </div>
          </div>
          <div className="product-tile__primary">
            <div className="tile-img__container">
              <div className="product-badge">New</div>
              <img src="https://placehold.co/200x800" alt="Product" />
            </div>
            <div className="tile-body__container">
              <div className="product-title">Sample Title</div>
              <div className="product-category">Sample Category</div>
              <div className="product-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
              <div className="tile-controls">
                <div className="product-price">Price: $ 9.99</div>
                <button className="prime-button tile-button">Add to Cart</button>
              </div>
            </div>
          </div>
          <div className="product-tile__primary">
            <div className="tile-img__container">
              <div className="product-badge">New</div>
              <img src="https://placehold.co/200x800" alt="Product" />
            </div>
            <div className="tile-body__container">
              <div className="product-title">Sample Title</div>
              <div className="product-category">Sample Category</div>
              <div className="product-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
              <div className="tile-controls">
                <div className="product-price">Price: $ 9.99</div>
                <button className="prime-button tile-button">Add to Cart</button>
              </div>
            </div>
          </div>
          <div className="product-tile__primary">
            <div className="tile-img__container">
              <div className="product-badge">New</div>
              <img src="https://placehold.co/200x800" alt="Product" />
            </div>
            <div className="tile-body__container">
              <div className="product-title">Sample Title</div>
              <div className="product-category">Sample Category</div>
              <div className="product-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
              <div className="tile-controls">
                <div className="product-price">Price: $ 9.99</div>
                <button className="prime-button tile-button">Add to Cart</button>
              </div>
            </div>
          </div>
          <div className="product-tile__primary">
            <div className="tile-img__container">
              <div className="product-badge">New</div>
              <img src="https://placehold.co/200x800" alt="Product" />
            </div>
            <div className="tile-body__container">
              <div className="product-title">Sample Title</div>
              <div className="product-category">Sample Category</div>
              <div className="product-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
              <div className="tile-controls">
                <div className="product-price">Price: $ 9.99</div>
                <button className="prime-button tile-button">Add to Cart</button>
              </div>
            </div>
          </div>
          <div className="product-tile__primary">
            <div className="tile-img__container">
              <div className="product-badge">New</div>
              <img src="https://placehold.co/200x800" alt="Product" />
            </div>
            <div className="tile-body__container">
              <div className="product-title">Sample Title</div>
              <div className="product-category">Sample Category</div>
              <div className="product-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
              <div className="tile-controls">
                <div className="product-price">Price: $ 9.99</div>
                <button className="prime-button tile-button">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>

  )
}

export default Welcome