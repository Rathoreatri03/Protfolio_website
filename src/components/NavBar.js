import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../assets/img/logo.png";
import navIcon1 from '../assets/img/nav-icon1.svg'; // LinkedIn icon
import navIcon2 from '../assets/img/nav-icon2.svg'; // Twitter icon (updated)
import navIcon3 from '../assets/img/nav-icon3.svg'; // GitHub icon (updated)
import navIcon4 from '../assets/img/nav-icon4.svg'; // Instagram icon (updated)
import navIcon5 from '../assets/img/nav-icon5.svg'; // Fifth social media icon
import { HashLink } from 'react-router-hash-link';
import {
  BrowserRouter as Router
} from "react-router-dom";

export const NavBar = () => {

  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  }

  return (
      <Router>
        <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
          <Container>
            <Navbar.Brand href="/">
              <img src={logo} alt="Logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav">
              <span className="navbar-toggler-icon"></span>
            </Navbar.Toggle>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Home</Nav.Link>
                <Nav.Link href="#skills" className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('skills')}>Skills</Nav.Link>
                <Nav.Link href="#projects" className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projects')}>Projects</Nav.Link>
              </Nav>
              <span className="navbar-text">
              <div className="social-icon">
                <a href="https://www.linkedin.com/in/rathoreatri03/" target="_blank" rel="noopener noreferrer">
                  <img src={navIcon1} alt="LinkedIn" />
                </a>
                <a href="https://github.com/Rathoreatri03" target="_blank" rel="noopener noreferrer">
                  <img src={navIcon2} alt="Twitter" />
                </a>
                <a href="https://www.instagram.com/rathoreatri_03/" target="_blank" rel="noopener noreferrer">
                  <img src={navIcon3} alt="GitHub" />
                </a>
                <a href="mailto:rahoreatri@gmail.com" target="_blank" rel="noopener noreferrer">
                  <img src={navIcon4} alt="Instagram" />
                </a>
                {/* Fifth icon */}
                <a href="https://x.com/rathoreatri03" target="_blank" rel="noopener noreferrer">
                  <img src={navIcon5} alt="New Social Media" />
                </a>
              </div>
              <HashLink to='#connect'>
                <button className="vvd"><span>Let’s Connect</span></button>
              </HashLink>
            </span>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Router>
  )
}
