import { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from './admin/components/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import Product from './admin/pages/Product'
import Category from './admin/pages/Category'
import Promo from './admin/pages/Promo'
import Orders from './admin/pages/Orders'
import { Toaster } from 'react-hot-toast';
import ClientLayout from './client/components/ClientLayout'
import Welcome from './client/pages/Welcome'
import axios from 'axios'
import Cart from './client/pages/Cart'
import Inventory from './admin/pages/Inventory'

function App() {
  axios.defaults.withCredentials = true;
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  useEffect(() => {
    checkLogin()
  }, [])

const checkLogin = async(request, response) => {
  try {
    if (userLoggedIn) {
      await axios.get('http://localhost:8000/auth')
    }
    
    setUserLoggedIn(true)
  } catch {
    setUserLoggedIn(false)
  }
}

  const adminRoutes = [
    { path: "", element: <Dashboard /> },
    { path: "orders", element: <Orders /> },
    { path: "inventory", element: <Inventory /> },
    { path: "crud/product", element: <Product /> },
    { path: "crud/category", element: <Category /> },
    { path: "crud/promo", element: <Promo /> },
  ];

  return (
    <>
      <Toaster
          toastOptions={{
            style: {
              zIndex: 9999,
              fontFamily: 'ITCAvantGardeBK, sans-serif',
            },
          }}
        />
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Welcome />} />
          <Route path="cart" element={<Cart />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          {adminRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Routes>
    </>
  )
}

export default App
