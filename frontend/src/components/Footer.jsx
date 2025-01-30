import React from 'react';
import '../assets/styles/Footer.css'; // Updated CSS import path

const Footer = () => {
    return (
         <footer className="footer">
            <div className="footer-container">
                 <div className="footer-logo">
                    LOGO
                </div>
                <div className="footer-links-container">
                   <div className="footer-links">
                     <h6>Service</h6>
                        <ul className="links">
                             <li>Architectural</li>
                            <li>Interior Design</li>
                           <li>Lighting Installation</li>
                            <li>Flow Planing</li>
                        </ul>
                     </div>
                    <div className="footer-links">
                    <h6>About Us</h6>
                         <ul className="links">
                            <li>About us</li>
                             <li>Our Team</li>
                             <li>Testimonials</li>
                            <li>Contact</li>
                        </ul>
                     </div>
                    <div className="footer-links">
                      <h6>Recent Work</h6>
                       <div className="image-container">
                        <img src="/images/logo.svg" alt="" />
                           <img src="/images/logo.svg" alt="" />
                            <img src="/images/logo.svg" alt="" />
                           <img src="/images/logo.svg" alt="" />
                       </div>
                    </div>
                </div>
                <div className="footer-copyright">
                     Copyright @ 2023 KAS LLC, All rights reserved
                </div>

            </div>
        </footer>
    );
};

export default Footer;