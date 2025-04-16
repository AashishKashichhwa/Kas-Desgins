import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const services = [
  {
    title: 'Architectural',
    description: 'Comprehensive architectural design services tailored to your vision and needs.',
  },
  {
    title: 'Interior Design',
    description: 'Stylish and functional interior design solutions that transform your space.',
  },
  {
    title: 'Lighting Installation',
    description: 'Innovative and aesthetic lighting setups to enhance your environment.',
  },
  {
    title: 'Flow Planning',
    description: 'Smart layout and spatial planning to optimize movement and utility.',
  },
]

const Services = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-12 text-center">Our Services</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <h2 className="text-2xl font-semibold mb-3">{service.title}</h2>
              <p className="text-gray-300">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Services
