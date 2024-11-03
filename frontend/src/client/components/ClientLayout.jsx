import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import Header from './Header'


const ClientLayout = () => {
  return (
    <div className='client-side'>
        <div className="utility-bar">
          <div className='utility-bar__text'>Opening Sale! 50% discounts for first-time purchasers</div>
          <div className='utility-div'>
            <Link>Privacy Policy</Link>
            <Link>Terms of Use</Link>
          </div>
        </div>
        <Header />
        <div className="main-content">
            <Outlet />
        </div>
    </div>
  )
}

export default ClientLayout