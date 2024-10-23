import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'


const ClientLayout = () => {
  return (
    <div className='client-side'>
        <Header />
        <div className="main-content">
            <Outlet />
        </div>
    </div>
  )
}

export default ClientLayout