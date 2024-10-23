import React from 'react'
import './styles/Modal.css'
import { Link } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import mainLogo from '../../assets/main-logo.png'

const LoginModal = ({ setModalOpen }) => {
  return (
    <div onClick={() => { setModalOpen(false) }} className="modal-background">
        <div onClick={(e) => e.stopPropagation()} className="login-modal__container">
          <div className="logo-container">
            <img src={mainLogo} alt="" />
          </div>
          <hr />
          <div className="form-selection">
            <button className="styled-button active">Sign In</button>
            <button className="styled-button">Sign Up</button>
          </div>
          <form className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email ID</label> 
              <input name="email" id="email" type="text" placeholder='Enter your Email Address'/>
            </div>
            <div className="input-group">
              <label htmlFor="Password">Password</label> 
              <input name="Password" id="Password" type="password" placeholder='Enter your Password'/>
            </div>
            <div className="between-utils">
              <div className="remember-me">
                <input type="checkbox" className='remember-me__checkbox'/>
                <label htmlFor="checkbox">Remember Me?</label>
              </div>
              <div>
                <Link>Forgot Password</Link>
              </div>
            </div>
            <button className='full-width prime-button'>
              Login
            </button>
          </form>
          <div class="line-break">
              <span>Or Sign in with</span>
          </div>
          <div className="alt-login">
            <button className='prime-button facebook-button'>
              <FaFacebook className='btn-icon'/>
              Facebook
            </button>
            <button className='prime-button gmail-button'>
              <BiLogoGmail className='btn-icon'/>
              Gmail
            </button>
          </div>
        </div>
    </div>
  )
}

export default LoginModal