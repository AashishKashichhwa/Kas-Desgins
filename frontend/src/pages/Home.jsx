import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import '../assets/styles/Home.css';

// //Placeholder components
// const CreativeSolutions = () => <section className="placeholder-section"><h2>Creative Solutions</h2></section>;
// const OurInteriors = () => <section className="placeholder-section"><h2>Our Interiors Designed</h2></section>;
// const ServicesProvided = () => <section className="placeholder-section"><h2>Services Provided</h2></section>;
// const FeaturedProjects = () => <section className="placeholder-section"><h2>Our Featured Projects</h2></section>;
// const HowWeWork = () => <section className="placeholder-section"><h2>How We Work</h2></section>;
// const WhatPeopleThink = () => <section className="placeholder-section"><h2>What People Think</h2></section>;
// const LatestPosts = () => <section className="placeholder-section"><h2>Latest Posts</h2></section>;


const Home = () => {
    return (
        <div>
          <Navbar />
            <Hero />
            {/* <CreativeSolutions/>
            <OurInteriors/>
            <ServicesProvided/>
            <FeaturedProjects/>
             <HowWeWork/>
           <WhatPeopleThink/>
            <LatestPosts/> */}
          <Footer />
        </div>
    );
};

export default Home;