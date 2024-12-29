import React from 'react';
import { motion } from 'framer-motion';

const VideoHomeComponent = () => {
  const videos = [
    
    {
      src: "https://videos.pexels.com/video-files/4683406/4683406-hd_1066_1920_25fps.mp4",
      poster: "https://via.placeholder.com/300x200",
    },
    
    {
      src: "https://videos.pexels.com/video-files/4620563/4620563-uhd_1440_2732_25fps.mp4",
      poster: "https://via.placeholder.com/300x200",
    },
    {
      src: "https://videos.pexels.com/video-files/7577348/7577348-uhd_1440_2560_24fps.mp4",
      poster: "https://via.placeholder.com/300x200",
    },
    {
      src: "https://videos.pexels.com/video-files/6755231/6755231-hd_1080_1920_30fps.mp4",
      poster: "https://via.placeholder.com/300x200",
    },
    {
      src: "https://videos.pexels.com/video-files/6112840/6112840-hd_1080_1940_25fps.mp4",
      poster: "https://via.placeholder.com/300x200",
    },
  ];

  return (
    <div>
      <h1 className="text-center font-bold text-3xl mt-5 mb-10">Insta Fusion</h1>
      {/* Video Elements in a Scrollable Row */}
      <div className="overflow-x-scroll hide-scroll-bar p-4 px-5 sm:px-10 md:px-20">
        <div className="flex space-x-10 justify-center">
          {videos.map((video, index) => (
            <motion.div
              key={index}
              className="h-[20rem] w-[12rem] sm:h-[25rem] sm:w-[15rem] md:h-[30rem] md:w-[20rem] flex-shrink-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <video
                src={video.src}
                className="w-full h-full object-cover rounded-xl"
                autoPlay
                muted
                loop
                controls={false}
                preload="metadata"
                loading="lazy"
                poster={video.poster}
              ></video>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoHomeComponent;
