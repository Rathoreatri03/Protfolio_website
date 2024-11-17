import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import headerImg from "../assets/img/header-img.svg";
import { ArrowRightCircle } from "react-bootstrap-icons";
import "animate.css";
import TrackVisibility from "react-on-screen";

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(150); // Typing speed
  const [index, setIndex] = useState(1);
  const toRotate = [
    "Computer Vision Engineer",
    "Data Analyst",
    "Business Analyst",
    "ML Engineer",
    "ML Developer",
    "Model Trainer",
    "Blender Artist",
  ];
  const period = 1500; // Transition period between roles

  useEffect(() => {
    const ticker = setInterval(() => {
      tick();
    }, delta);

    return () => clearInterval(ticker);
  }, [text]);

  useEffect(() => {
    createStars();
  }, []); // Initialize stars on mount

  const tick = () => {
    const i = loopNum % toRotate.length;
    const fullText = toRotate[i];
    const updatedText = isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex((prevIndex) => prevIndex - 1);
    } else if (isDeleting && updatedText === "") {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
    }

    setDelta(150); // Typing and deleting speed
  };

  const createStars = () => {
    const starField = document.querySelector(".starfield");
    if (!starField) return;

    for (let i = 0; i < 100; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`; // Spread stars vertically
      star.style.animationDelay = `${Math.random() * 5}s`;
      starField.appendChild(star);
    }
  };

  return (
      <section className="banner" id="home">
        <Container>
          <Row className="align-items-center">
            <Col xs={12} md={6} xl={7}>
              <TrackVisibility>
                {({ isVisible }) => (
                    <div
                        className={
                          isVisible ? "animate__animated animate__fadeIn" : ""
                        }
                    >
                      <span className="tagline">Let's Innovate the Future</span>
                      <h1>{`Hi! I'm Atri Rathore`}</h1>
                      <div className="typing-effect">
                    <span
                        className="txt-rotate"
                        dataPeriod="500"
                        data-rotate='[ "Computer Vision Engineer", "Data Analyst", "Business Analyst", "ML Engineer", "ML Developer", "Model Trainer", "Blender Artist" ]'
                        style={{ color: '#D3D3D3' }}  /* Inline style to change text color */
                    >
                      <span className="wrap">{text}</span>
                    </span>
                      </div>
                      <p>
                        As deeply passionate about leveraging cutting-edge technologies in artificial intelligence, machine learning, and computer vision to solve real-world problems. With hands-on experience in building and training machine learning models, designing innovative AI systems, and creating impactful solutions, I focus on driving efficiency and enhancing user experiences across various domains. From developing autonomous systems to working with complex data analytics and 3D modeling, I thrive in tackling diverse challenges and pushing the boundaries of what’s possible. My approach is always centered around continuous learning, creativity, and a drive to make a meaningful impact through technology.
                      </p>
                      <button onClick={() => console.log("connect")}>
                        Let’s Connect <ArrowRightCircle size={25} />
                      </button>
                    </div>
                )}
              </TrackVisibility>
            </Col>
            <Col xs={12} md={6} xl={5}>
              <TrackVisibility>
                {({ isVisible }) => (
                    <div
                        className={
                          isVisible ? "animate__animated animate__zoomIn" : ""
                        }
                    >
                      <img src={headerImg} alt="Header Img" />
                    </div>
                )}
              </TrackVisibility>
            </Col>
          </Row>
        </Container>
        <div className="starfield"></div>
      </section>
  );
};
