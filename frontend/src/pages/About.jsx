import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../assets/styles/About.css'

const About = () => {
  return (
    <div className="about-container">
      <Navbar />

      <div className="about-content">
        <section className="section">
          <h1 className="section-title">About Kas Designs</h1>
          <p className="section-text">
            Founded in 2022, <span className="highlight">Kas Designs</span> is a forward-thinking
            interior design and architecture firm dedicated to transforming spaces into experiences.
            Our team of passionate creatives and technical experts blend art, innovation, and
            functionality to deliver timeless spaces that inspire.
          </p>
          <p className="section-text">
            At Kas Designs, we specialize in a range of services including architectural design,
            interior styling, lighting installation, and flow planning. Whether it’s a residential
            haven, a modern workspace, or a boutique commercial spot — we approach every project with
            precision, creativity, and a commitment to excellence.
          </p>
          <p className="section-text">
            Since our inception, our goal has been to not just design spaces, but to create
            environments that elevate the lives of those who experience them. With a focus on quality,
            sustainability, and innovation, Kas Designs continues to set new standards in the world of
            interior design.
          </p>
        </section>

        <section className="section">
          <h2 className="section-title">Our Team</h2>
          <p className="section-text">
            Our team is made up of visionary architects, creative interior designers, lighting
            specialists, and project managers — all working collaboratively to deliver cohesive,
            high-quality results. With years of experience and a passion for innovation, our team
            ensures every project exceeds expectations.
          </p>
        </section>

        <section className="section">
          <h2 className="section-title">Testimonials</h2>
          <div className="testimonial-box">
            <p className="testimonial-text">
              “Kas Designs turned my apartment into a dream home. Their attention to detail and style
              is unmatched.” — <span className="testimonial-author">Rhea M.</span>
            </p>
            <p className="testimonial-text">
              “From start to finish, the team was professional, creative, and super friendly.” —
              <span className="testimonial-author">Karan S.</span>
            </p>
            <p className="testimonial-text">
              “I was blown away by the lighting and spatial planning. Highly recommended!” —
              <span className="testimonial-author">Anjali D.</span>
            </p>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Contact Us</h2>
          <p className="section-text">
            Ready to transform your space? Reach out to us for consultations, collaborations, or just
            to say hello.
          </p>
          <ul className="contact-list">
            <li>Email: <a href="mailto:contact@kasdesigns.com">contact@kasdesigns.com</a></li>
            <li>Phone: +977 98765 43210</li>
            <li>Location: Bhaktapur, Nepal</li>
          </ul>
        </section>
      </div>

      <Footer />
    </div>
  )
}

export default About
