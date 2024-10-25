import React, { useState, useEffect } from 'react'
import './styles/Modal.css'
import { Link } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import mainLogo from '../../assets/main-logo.png'
import { createFunc } from '../../admin/utils/crudUtils'
import axios from 'axios'

const LoginModal = ({ setModalOpen, formActive, setFormActive  }) => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [formState, setFormState] = useState({email:'', password:''})
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }
    ));
  console.log(formState)
  };

  const loginAttempt = async(request, response) => {
    try {
      const data = await axios.post("http://localhost:8000/auth", formState)
      console.log(data)
      setLoggedIn(true)
      window.location.reload()
    } catch (e) {
      console.log("Error logging in.", e)
      setLoggedIn(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    createFunc('user', formState)
    loginAttempt()
  }

  const handleLogin = (e) => {
    e.preventDefault();
    loginAttempt()
  }

  return (
    <div onClick={() => { setModalOpen(false) }} className="modal-background">
        <div onClick={(e) => e.stopPropagation()} className="login-modal__container">
          <div className="logo-container">
            <img src={mainLogo} alt="" />
          </div>
          <hr />
          <div className="form-selection">
            <button
                className={`styled-button ${formActive === 'login' ? 'active' : ''}`}
                onClick={() => setFormActive('login')}
              >
                Sign In
            </button>

            <button
                className={`styled-button ${formActive === 'register' ? 'active' : ''}`}
                onClick={() => setFormActive('register')}
              >
                Sign Up
            </button>
          </div>
          <div className={`form-panel ${formActive === 'login' ? 'login-active' : 'register-active'}`}>
            <form onSubmit={handleLogin} className="login-form">
              <div className="input-group">
                <label htmlFor="email">Email Address</label> 
                <input 
                  name="email" 
                  id="email" 
                  type="text" 
                  placeholder='Enter your Email Address'
                  value={formState.email}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="Password">Password</label> 
                <input 
                  name="password" 
                  id="password" 
                  type="password" 
                  placeholder='Enter your Password'
                  value={formState.password}
                  onChange={handleChange}
                />
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
            <form onSubmit={handleSubmit} className="register-form">
              <div className="input-group">
                <label htmlFor="email">Email Address</label> 
                <input 
                  name="email" 
                  id="email" 
                  type="text" 
                  placeholder='Enter your Email Address'
                  value={formState.email}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label htmlFor="Password">Password</label> 
                <input 
                  name="password" 
                  id="password" 
                  type="password" 
                  placeholder='Enter your Password'
                  value={formState.password}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className='full-width prime-button'>
                Sign Up
              </button>
            </form>
          </div>
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