import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Register from './components/register/Register.jsx'
import Login from './components/login/Login.jsx'
import Home from './components/home/Home.jsx'
import ProductDetail from './components/product/ProductDetail.jsx'
import Backoffice from './components/BackOffice.jsx'
import Cart from './components/cart/Cart.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import 'bulma/css/bulma.min.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/backoffice" element={<Backoffice />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>
)
