import React, { useEffect, useState } from 'react'
import './styles/Header.css'
import mainLogo from '../../assets/main-logo.png'
import { Link } from 'react-router-dom'
import { FaSearch, FaShoppingBag , FaUser  } from "react-icons/fa";
import LoginModal from './LoginModal'
import { CSSTransition } from 'react-transition-group';
import axios from 'axios'
import UserForm from './UserForm'

const Header = () => {
  const [formActive, setFormActive] = useState('login')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalOpenUser, setModalOpenUser] = useState(false)
  axios.defaults.withCredentials = true;
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [basicInfo, setBasicInfo] = useState({id: '', email: ''})
  const [userId, setUserId] = useState('')
  const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = () => {
        if (window.scrollY >= 800) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []); 
  
  useEffect(() => {
      checkLogin()
      console.log(userLoggedIn)
    }, [])

  const checkLogin = async(request, response) => {
    try {
      const response = await axios.get('http://localhost:8000/auth')
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
    <div id="navbar" className={`client-header ${isScrolled ? 'scrolled' : 'not-scrolled'}`}>
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
            <Link to="/cart"><FaShoppingBag /></Link>
  
            { userLoggedIn ? (
              <div onClick={() => {logoutUser()}}>Logout</div>
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
                  <LoginModal setBasicInfo={setBasicInfo} setModalOpen={setModalOpen} formActive={formActive} setFormActive={setFormActive} setUserModal={setModalOpenUser} />
                </CSSTransition>

                <CSSTransition
                  in={modalOpenUser}
                  timeout={300}
                  classNames="modal"
                  unmountOnExit
                >
                  <UserForm modalOpen={modalOpenUser} basicInfo={basicInfo} setModalOpen={setModalOpenUser}/>
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