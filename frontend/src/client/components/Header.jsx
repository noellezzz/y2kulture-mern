import React, { useEffect, useState } from 'react'
import './styles/Header.css'
import mainLogo from '../../assets/main-logo.png'
import { Link } from 'react-router-dom'
import { FaSearch, FaShoppingBag , FaUser  } from "react-icons/fa";
import LoginModal from './LoginModal'
import { CSSTransition } from 'react-transition-group';
import axios from 'axios'

const Header = () => {
  const [formActive, setFormActive] = useState('login')
  const [modalOpen, setModalOpen] = useState(false)
  axios.defaults.withCredentials = true;
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  useEffect(() => {
      checkLogin()
      console.log(userLoggedIn)
    }, [])

  const checkLogin = async(request, response) => {
    try {
      const response = await axios.get('http://localhost:8000/auth')
      console.log(response.data)
      setUserLoggedIn(true)
      setUserEmail(response.data.user.email)
    } catch {
      setUserLoggedIn(false)
    }
  }

  const logoutUser =  async() => {
    try {
      await axios.get('http://localhost:8000/auth/logout')
      window.location.reload();
    } catch (e) {
      console.log(e)
    }
  }

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
  
            { userLoggedIn ? (
              <div onClick={() => {logoutUser()}}>{userEmail}</div>
            ) : (
              <>
                <Link onClick={() => { setModalOpen(true) }}>
                  <FaUser />
                </Link>
  
                <CSSTransition
                  in={modalOpen}
                  timeout={300}
                  classNames="modal"
                  unmountOnExit
                >
                  <LoginModal setModalOpen={setModalOpen} formActive={formActive} setFormActive={setFormActive}/>
                </CSSTransition>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
  
}

export default Header