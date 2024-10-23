import React, { useEffect, useState } from 'react'
import './styles/Header.css'
import mainLogo from '../../assets/main-logo.png'
import { Link } from 'react-router-dom'
import { FaSearch, FaShoppingBag , FaUser  } from "react-icons/fa";
import LoginModal from './LoginModal'
import { CSSTransition } from 'react-transition-group';

const Header = () => {
  const [formActive, setFormActive] = useState('login')
  const [modalOpen, setModalOpen] = useState([false])
  useEffect(() => {
    if(modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalOpen])

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
            <Link 
              onClick={() => { setModalOpen(true) }}
            ><FaUser /></Link>
          </div>
        </div>
      </nav>
      <CSSTransition
            in={modalOpen}
            timeout={300}
            classNames="modal"
            unmountOnExit
        >
            <LoginModal setModalOpen={setModalOpen} formActive={formActive} setFormActive={setFormActive}/>
        </CSSTransition>
    </div>
  )
}

export default Header