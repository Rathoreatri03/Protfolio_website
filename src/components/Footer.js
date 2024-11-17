import { Container, Row, Col } from "react-bootstrap";
import { MailchimpForm } from "./MailchimpForm";
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
          <MailchimpForm />
          <Col size={12} sm={6}>
            <img src={logo} alt="Logo" />
          </Col>
          <Col size={12} sm={6} className="text-center text-sm-end">
            <div className="social-icon">
              <a href="https://www.linkedin.com/in/rathoreatri03/" target="_blank" rel="noopener noreferrer">
                <img src={navIcon1} alt="LinkedIn"/>
              </a>
              <a href="https://github.com/Rathoreatri03" target="_blank" rel="noopener noreferrer">
                <img src={navIcon2} alt="Twitter"/>
              </a>
              <a href="https://www.instagram.com/rathoreatri_03/" target="_blank" rel="noopener noreferrer">
                <img src={navIcon3} alt="GitHub"/>
              </a>
              <a href="mailto:rahoreatri@gmail.com" target="_blank" rel="noopener noreferrer">
                <img src={navIcon4} alt="Instagram"/>
              </a>
              {/* Fifth icon */}
              <a href="https://x.com/rathoreatri03" target="_blank" rel="noopener noreferrer">
                <img src={navIcon5} alt="New Social Media"/>
              </a>
            </div>
            <p>Copyright 2022. All Rights Reserved</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
