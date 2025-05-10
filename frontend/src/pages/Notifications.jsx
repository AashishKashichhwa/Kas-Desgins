import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import UserNotifications from '../components/UserNotifications'

const Products = () => {
  return (
    <div>
      <Navbar/>
      <div className='contents'>
      <h2>Notifications</h2>
      <UserNotifications/>
      </div>
      <Footer/>
    </div>
  )
}

export default Products
