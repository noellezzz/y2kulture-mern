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

function App() {
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get('http://localhost:8000/auth')
    .then((response) => {
      console.log("Is Logged in", response)
    })
  }, [])

  const adminRoutes = [
    { path: "", element: <Dashboard /> },
    { path: "orders", element: <Orders /> },
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
            },
          }}
        />
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Welcome />} />
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
