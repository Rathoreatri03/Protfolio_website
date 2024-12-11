import { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import professionalLinks from '../assets/json_data/professionalLinks.json';

export const ProfessionalSection = () => {
    const [links, setLinks] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setLinks(professionalLinks);
    }, []);

    // Function to open the modal
    const openVideoModal = () => {
        setIsModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="professional-section-container">
            <div className="professional-section-box">
                <h3>Professional Window</h3>
                <p>
                    Welcome to my "Professional Window" section, where you can explore a glimpse into my career and skills.
                    With a passion for technology and innovation, I am always seeking opportunities to grow and expand my expertise.
                    In this section, you can watch my video resume (Visume) to get a dynamic overview of my professional journey,
                    or download my detailed resume for a comprehensive look at my qualifications and experience.
                    Whether you're here to learn more about my work or explore potential opportunities, this is where you can find the
                    essential details to understand my professional background.
                </p>
                <div className="buttons-container">
                    <button className="prof-btn" onClick={openVideoModal}>
                        <h4>Visume</h4>
                    </button>
                    <button className="prof-btn">
                        <a href={links.resume} download target="_blank" rel="noopener noreferrer">
                            <h4>Resume</h4>
                        </a>
                    </button>
                </div>
            </div>

            {/* Modal for the video */}
            <ReactModal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Visume Video"
                className="video-modal"
                overlayClassName="video-modal-overlay"
                shouldCloseOnOverlayClick={true} // Close on overlay click
                closeTimeoutMS={300} // Delay closing the modal for smooth transition
            >
                {/* Custom Close Button */}
                <button onClick={closeModal} className="close-modal-btn">
                    <span className="visually-hidden">Close</span> {/* Screen reader accessibility */}
                </button>
                <iframe
                    width="100%"
                    height="400px"
                    src={process.env.PUBLIC_URL + links.visume}
                    title="Visume"
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </ReactModal>

        </div>
    );
};
