import React from 'react';
import '../assets/styles/Hero.css';
import darkInterior from '../assets/images/dark-interior.jpeg'; // Import the image

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Design Your Space For Living</h1>
          <img className= "bgImage" src={darkInterior} alt="Interior" /> {/* Use the imported variable */}
          <p className="hero-description">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text ever
            since the 1500s, when
          </p>
          <button className="hero-button">Learn more</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;