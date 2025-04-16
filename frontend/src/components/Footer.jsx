import React from 'react';
import { FaFacebookF, FaInstagram, FaMapMarkerAlt } from 'react-icons/fa';
import '../assets/styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Left: Logo and copyright */}
                <div className="footer-left">
                    <div className="footer-logo">KAS LLC</div>
                    <div className="footer-copyright">
                        © 2023 KAS LLC. All rights reserved.
                    </div>
                </div>



                {/* Right: Contact Info */}
                <div className="footer-right">
                    <div className="footer-section">
                        <h4>Contact</h4>
                        <p>9876543210</p>
                        <p>kasdesigns@gmail.com</p>
                    </div>
                    <div className="social-icons">
                        <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                            <FaFacebookF />
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                            <FaInstagram />
                        </a>
                    </div>
                </div>
                {/* Center: Location */}
                <div className="footer-center">
                    <div className="footer-section">
                        <h4>Location</h4>
                        <p>
                            Lazimpat, Kathmandu <FaMapMarkerAlt className="location-icon" />
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
