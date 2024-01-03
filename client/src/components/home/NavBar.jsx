import React from 'react';
import { motion } from 'framer-motion';

const NavBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -180 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ease: 'easeInOut',
        duration: 1,
        delay: 0.6,
      }}
      className="header"
    >
      <div className="header-inner">
        <div className="logo">Crib</div>
        <nav className="nav">
          <li>
            <a href="/design">Home</a>
          </li>
          <li>
            <a href="/strategy">Partner</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </nav>
        <div className="contact">
          <a href="/contact">Let's work together</a>
        </div>
        <div className="hamburger-menu">
          <span></span>
          <span></span>
        </div>
      </div>
    </motion.div>
  );
};

export default NavBar;
