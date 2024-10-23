import React from 'react'
import './styles/Header.css'
import mainLogo from '../../assets/main-logo.png'
import { Link } from 'react-router-dom'
import { FaSearch, FaShoppingBag , FaUser  } from "react-icons/fa";

const Header = () => {
  return (
    <div className='client-header'>
      <nav className='client-navigation'>
        <div className="title-container">
          <img src={mainLogo} alt="main-logo" />
        </div>

        <div className="main-navigation">
          <div className="navigation-line">
            <Link>Home</Link>
            <Link>Store</Link>
            <Link>About Us</Link>
            <Link>Support</Link>
          </div>
        </div>
        <div className="side-navigation">
          <div className="navigation-line">
            <Link><FaSearch /></Link>
            <Link><FaShoppingBag /></Link>
            <Link><FaUser /></Link>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header