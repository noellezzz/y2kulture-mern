import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from './admin/components/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import Product from './admin/pages/Product'
import Category from './admin/pages/Dashboard'
import Promo from './admin/pages/Dashboard'
import Orders from './admin/pages/Orders'

function App() {
  const adminRoutes = [
    { path: "", element: <Dashboard /> },
    { path: "orders", element: <Orders /> },
    { path: "crud/product", element: <Product /> },
    { path: "crud/category", element: <Category /> },
    { path: "crud/promo", element: <Promo /> },
  ];

  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        {adminRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Route>
    </Routes>
    
  )
}

export default App
