import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ViewProductsUser from '../components/ViewProductsUser'

const Products = () => {
  return (
    <div>
      <Navbar/>
      <h2>Products</h2>
      <ViewProductsUser/>
      <Footer/>
    </div>
  )
}

export default Products
