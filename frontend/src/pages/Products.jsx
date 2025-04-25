import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ViewProducts from '../components/ViewProducts'

const Products = () => {
  return (
    <div>
      <Navbar/>
      <h2>Products</h2>
      <ViewProducts/>
      <Footer/>
    </div>
  )
}

export default Products
