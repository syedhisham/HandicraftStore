import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const LoadingOverlay = () => {
  const spinnerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // GSAP animation for the spinner
    gsap.to(spinnerRef.current, {
      rotation: 360,
      duration: 2, 
      repeat: -1, 
      ease: "linear"
    });

    // GSAP animation for the "Loading..." text (fade-in effect)
    gsap.fromTo(
      textRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, repeat: -1, yoyo: true, ease: "power1.inOut" }
    );
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          {/* Spinner with GSAP Animation */}
          <div
            ref={spinnerRef}
            className="w-16 h-16 border-t-4 border-orange-500 border-solid rounded-full"
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg">
            <span ref={textRef}>Loading...</span>
          </div>
        </div>
        <p className="mt-2 text-white text-lg">Please wait...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
