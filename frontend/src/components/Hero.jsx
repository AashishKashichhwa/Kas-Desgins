import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Hero.css';
import image1 from '../assets/images/image1.jpeg';
import image2 from '../assets/images/image2.jpg';
import image3 from '../assets/images/image3.jpeg';

const Hero = () => {
    const navigate = useNavigate(); // Get the navigate function from React Router

    const handleLearnMore = () => {
        navigate('/about'); // Navigate to the About page when button is clicked
    };

    return (
        <section className="hero">
            <div className="hero-container">
                <div className='sketchup'>
                    <div className="hero-content">
                        <h1 className="hero-title">Design Your Space For Living</h1>
                        <p className="hero-description">
                        At Kas Designs, we specialize in a range of services including architectural design,
            interior styling, lighting installation, and flow planning. Whether it's a residential
            haven, a modern workspace, or a boutique commercial spot — we approach every project with
            precision, creativity, and a commitment to excellence.
                        </p>
                        <button className="hero-button" onClick={handleLearnMore}>Learn more</button>
                    </div>
                    <div className="sketchfab-embed-wrapper">
                        <iframe
                            title="The Smoking Room"
                            frameBorder="0"
                            allowFullScreen
                            mozallowfullscreen="true"
                            webkitallowfullscreen="true"
                            allow="autoplay; fullscreen; xr-spatial-tracking"
                            xr-spatial-tracking
                            execution-while-out-of-viewport
                            execution-while-not-rendered
                            web-share
                            src="https://sketchfab.com/models/2247ed77976a40b6ae81271cd6b149c8/embed?ui_infos=0&ui_watermark_link=0&ui_watermark=0"
                        >
                        </iframe>
                    </div>
                </div>
            </div>
           <section className='sections'>
              <div className='section-container'>
               <div className='section-text'>
                 <h2 className='section-title'>Creative Solutions by Professional</h2>
                   <p className='section-description'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
                <div className='section-cards'>
                      <div className='card'>
                       <p>53k</p>
                        <p>Happy Client</p>
                    </div>
                   <div className='card'>
                       <p>10k</p>
                      <p>Projects Done</p>
                  </div>
                  <div className='card'>
                        <p>120</p>
                         <p>Get Award</p>
                      </div>
                </div>
                </div>
                  <div className='section-image'>
                      <img src={image1} alt="" />
                       <img src={image2} alt="" />
                    </div>
                </div>
              <div className='section-container2'>
                 <div className='section-image section-image-bottom'>
                      <img src={image3} alt="" />
                  </div>
                   <div className='section-text section-text-bottom'>
                    <h2 className='section-title'>Our interiors designed to last a lifetime</h2>
                    <p className='section-description'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since</p>
                  </div>
              </div>
           </section>
        </section>
    );
};

export default Hero;