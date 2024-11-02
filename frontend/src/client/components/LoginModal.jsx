import React, { useState, useEffect } from 'react'
import './styles/Modal.css'
import { Link } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import mainLogo from '../../assets/main-logo.png'
import { createFunc } from '../../admin/utils/crudUtils'
import axios from 'axios'
import TextField from '@mui/material/TextField';

const LoginModal = ({ setModalOpen, formActive, setFormActive, setUserModal, setBasicInfo  }) => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [formState, setFormState] = useState({email:'', password:''})

  const resetForm = () => {
    setFormState({email:'', password:''})
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }
    ));
  };

  const loginAttempt = async(request, response) => {
    try {
      const data = await axios.post("http://localhost:8000/auth", formState)
      console.log(data)
      setLoggedIn(true)
    } catch (e) {
      console.log("Error logging in.", e)
      setLoggedIn(false)
    }
  }

  const login = async(e) => {
    e.preventDefault()
    loginAttempt()
    window.location.reload()
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    const response = await createFunc('user', formState)
    setBasicInfo({id: response.data.data._id, email: response.data.data.email})
    loginAttempt()
    setModalOpen(false)
    setUserModal(true)
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
                onClick={() => {
                  setFormActive('login')
                  resetForm()
                }}
              >
                Sign In
            </button>

            <button
                className={`styled-button ${formActive === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setFormActive('register')
                  resetForm()
                }}
              >
                Sign Up
            </button>
          </div>
          <div className={`form-panel ${formActive === 'login' ? 'login-active' : 'register-active'}`}>
            <form onSubmit={login} className="login-form">
              <div className="input-group">
                {/* <label htmlFor="email">Email Address</label>  */}
                <TextField 
                  label="Email" 
                  variant="standard"
                  name="email" 
                  // id="email" 
                  type="email" 
                  value={formState.email}
                  onChange={handleChange}
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "var(--primary-color)" 
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "var(--primary-color)" 
                    }
                }}
                />
              </div>
              <div className="input-group">
                {/* <label htmlFor="Password">Password</label>  */}
                <TextField 
                  label="Password" 
                  variant="standard"
                  name="password" 
                  // id="password" 
                  type="password" 
                  placeholder='Enter your Password'
                  value={formState.password}
                  onChange={handleChange}
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "var(--primary-color)" 
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "var(--primary-color)" 
                    }
                }}
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
              <button type="submit" className='full-width prime-button'>
                Login
              </button>
            </form>
            <form onSubmit={handleSubmit} className="register-form">
              <div className="input-group">
                {/* <label htmlFor="email">Email Address</label>  */}
                <TextField 
                  label="Email" 
                  variant="standard"
                  name="email" 
                  // id="email" 
                  type="email" 
                  placeholder='Enter your Email Address'
                  value={formState.email}
                  onChange={handleChange}
                  sx={{
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "var(--primary-color)" 
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "var(--primary-color)" 
                    }
                }}
                />
              </div>
              <div className="input-group">
                {/* <label htmlFor="Password">Password</label>  */}
                <TextField 
                  label="Password" 
                  variant="standard"
                  name="password" 
                  // id="password" 
                  type="password" 
                  placeholder='Enter your Password'
                  value={formState.password}
                  onChange={handleChange}
                  sx={{
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "var(--primary-color)" 
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: "var(--primary-color)" 
                      }
                  }}
                />
              </div>
              <button type="submit" className='mt-20 full-width prime-button'>
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