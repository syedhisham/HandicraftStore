import React, { useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import WarningGif from '../assets/warningGif.gif'

const Popup = ({ message, isOpen, onClose }) => {
  const popupRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigate

  // GSAP animation for the popup
  React.useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        popupRef.current,
        { y: "-100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    } else if (popupRef.current) {
      gsap.to(popupRef.current, {
        y: "-100%",
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginClick = () => {
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Popup Content */}
      <div
        ref={popupRef}
        className="bg-white rounded-lg shadow-xl p-6 w-96 text-center"
      >
        {/* <h2 className="text-2xl font-semibold text-gray-800">Notice</h2> */}
        <img src={WarningGif} alt="" className="w-24 h-24 mx-auto" />
        <p className="text-gray-600 mt-4">{message}</p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md transition-all"
          >
            Close
          </button>
          <button
            onClick={handleLoginClick}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-md transition-all"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
