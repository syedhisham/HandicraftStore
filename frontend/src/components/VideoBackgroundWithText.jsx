import React, { useState, useEffect, useRef } from "react";

const videos = [
  "https://videos.pexels.com/video-files/4443773/4443773-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/4463159/4463159-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/4814034/4814034-uhd_2560_1440_30fps.mp4",
];

const VideoBackgroundWithText = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleCanPlayThrough = () => {
      videoElement.play();
      setIsTransitioning(false);
    };

    const handlePlayNext = () => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
      }, 200);
    };

    videoElement.addEventListener("canplaythrough", handleCanPlayThrough);
    videoElement.addEventListener("ended", handlePlayNext);

    return () => {
      videoElement.removeEventListener("canplaythrough", handleCanPlayThrough);
      videoElement.removeEventListener("ended", handlePlayNext);
    };
  }, [currentVideoIndex]);

  return (
    <>
    <div className="relative w-full h-[65vh] overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
        key={currentVideoIndex}
        muted
        playsInline
        preload="auto"
        autoPlay
        loop={false}
      >
        <source src={videos[currentVideoIndex]} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Black Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-orange-400 opacity-50"></div>

      {/* Text Overlay */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-black/60 text-4xl md:text-6xl font-extrabold leading-tight">
          Discover the <span className="text-red-700 px-2 bg-white/30">Beauty</span> of{" "}
          <span className="text-orange-700 bg-white/30 px-2">Handcrafted</span> Art
        </h1>
        <p className="text-black/90 mt-4 text-lg md:text-xl max-w-3xl">
          Explore unique and authentic pieces from talented artisans across Pakistan.
        </p>
        {/* Thin Horizontal Line */}
        <hr className="w-[40%] border-t-4 border-orange-800 mt-4" />
      </div>
    </div>
    
    </>
  );
};

export default VideoBackgroundWithText;
