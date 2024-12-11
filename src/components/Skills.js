import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Meter } from './Meter';
import skillsData from '../assets/json_data/skillsData.json'; // Importing the JSON data

export const Skills = () => {
  const [skills, setSkills] = useState(skillsData.skills);

  const addSkill = (name, progress) => {
    setSkills([...skills, { name, progress }]);
  };

  const removeSkill = (name) => {
    setSkills(skills.filter(skill => skill.name !== name));
  };

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
      <section className="skill" id="skills">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="skill-bx wow zoomIn">
                <h2>Skills</h2>
                <p>Explore the expertise I've developed across various fields...</p>
                <Carousel
                    responsive={responsive}
                    infinite={true}
                    autoPlay={true}
                    autoPlaySpeed={2500}
                    loop={true}
                    className="owl-carousel owl-theme skill-slider"
                >
                  {skills.map((skill, index) => (
                      <div className="item" key={index}>
                        <Meter progress={skill.progress} />
                        <h5>{skill.name}</h5>
                      </div>
                  ))}
                </Carousel>

                {/* Example buttons to add/remove skills dynamically */}
                <button onClick={() => addSkill('New Skill', 70)}>Add New Skill</button>
                <button onClick={() => removeSkill('ML Research')}>Remove 'ML Research' Skill</button>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
};
