import { Container, Row, Col } from "react-bootstrap";
import logo from "../assets/img/logo.png";
import navIcon1 from "../assets/img/nav-icon1.svg";
import navIcon2 from "../assets/img/nav-icon2.svg";
import navIcon3 from "../assets/img/nav-icon3.svg";
import navIcon4 from "../assets/img/nav-icon4.svg";
import navIcon5 from "../assets/img/nav-icon5.svg";

export const Footer = () => {
  return (
      <footer className="footer">
        <Container>
          <Row className="align-items-center">
            <Col size={12} sm={6}>
              <img src={logo} alt="Your Brand Logo" className="footer-logo" />
            </Col>
            <Col size={12} sm={6} className="text-center text-sm-end">
              <div className="social-icon">
                <a
                    href="https://www.linkedin.com/in/rathoreatri03/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="social-icon-link"
                >
                  <img src={navIcon1} alt="LinkedIn" />
                </a>
                <a
                    href="https://github.com/Rathoreatri03"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="social-icon-link"
                >
                  <img src={navIcon2} alt="GitHub" />
                </a>
                <a
                    href="https://www.instagram.com/rathoreatri_03/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="social-icon-link"
                >
                  <img src={navIcon3} alt="Instagram" />
                </a>
                <a
                    href="mailto:rahoreatri@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Email"
                    className="social-icon-link"
                >
                  <img src={navIcon4} alt="Email" />
                </a>
                <a
                    href="https://x.com/rathoreatri03"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (formerly Twitter)"
                    className="social-icon-link"
                >
                  <img src={navIcon5} alt="X" />
                </a>
              </div>
              <p className="footer-text">Copyright 2024. All Rights Reserved</p>
              <p className="footer-quote">"Let's innovate and build the future, together."</p>
            </Col>

          </Row>
        </Container>
      </footer>
  );
};
