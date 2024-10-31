import React, { useState, useEffect } from 'react'
import './styles/Shared.css'
import heroImage from '../../assets/heroimage.png'
import { fetchData } from '../../admin/utils/crudUtils'
import Cookies from 'js-cookie';
import axios from 'axios'

const Welcome = () => {
  const [userId, setUserId] = useState('')
  // const [cartInfo, setCartInfo] = useState({})
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const checkLogin = async(request, response) => {
    try {
      const response = await axios.get('http://localhost:8000/auth')
      setUserLoggedIn(true)
      setUserId(response.data.user._id)
    } catch {
      setUserLoggedIn(false)
    }
  }

  const [productList, setProductList] = useState([])
  useEffect(() => {
    fetchData('product', setProductList)
    checkLogin()
  }, [])
  useEffect(() => {
    console.log(productList)
  }, [productList])

  const addToCart = async(productId) => {
    console.log(userId)
    let cartInfo = {
      productId: productId,
      quantity: 1,
    };
    try {
      const result = await axios.post(`http://localhost:8000/api/user/addToCart/${userId}`, cartInfo)
      console.log(result)
    } catch(e) {
      console.log("Error adding to cart", e)
    }
  }

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
          {
            productList.length == 0 ? (
              <div className="d">No Available Products</div>
            ) : (
              productList.map((product, index) => {
                return (
                  <div key={index} className="product-tile__primary">
                    <div className="tile-img__container">
                      <div className="product-badge">New</div>
                      <img src="https://placehold.co/200x800" alt="Product" />
                    </div>
                    <div className="tile-body__container">
                      <div className="product-title">{product.title}</div>
                      <div className="product-category">{product.category[0].title}</div>
                      <div className="product-description">{product.description}</div>
                      <div className="tile-controls">
                        <div className="product-price">Price: ${product.price}</div>
                        <button onClick={() => {addToCart(product._id)}} className="prime-button tile-button">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                )
              })
            )
          }

        </div>
      </section>
    </>

  )
}

export default Welcome