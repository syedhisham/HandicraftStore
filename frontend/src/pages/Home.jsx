import React, { useEffect, useState } from "react";
import { NavbarWithMegaMenu } from "../components/Header";
import { FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";
import { NavbarWithSearch } from "../components/NavbarWithSearch";
import { CarouselCustom } from "../components/Carousel";
import HomeContent from "../components/HomeContent";
import VideoBackgroundWithText from "../components/VideoBackgroundWithText";
import VideoHomeComponent from "../components/VideoHomeComponent";
import AllProducts from "../components/AllProducts";
import FeaturedArtisans from "../components/FeaturedArtisians";
import Footer from "../components/Footer";
import CustomerTestimonials from "../components/Testimonials";
import HighRatedProducts from "../components/HighRatedProducts";
import LoadingOverlay from "../components/LoadingOverlay";

const Home = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate data fetching or initialization
    const timer = setTimeout(() => setLoading(false), 2000); // Adjust the delay as needed
    return () => clearTimeout(timer); // Cleanup timer
  }, []);
  const handleSocialRedirect = (platform) => {
    switch (platform) {
      case "facebook":
        window.open("https://www.facebook.com", "_blank");
        break;
      case "youtube":
        window.open("https://www.youtube.com", "_blank");
        break;
      case "instagram":
        window.open("https://www.instagram.com", "_blank");
        break;
      default:
        break;
    }
  };

  return (
    <div className="overflow-x-hidden">
      {loading && <LoadingOverlay />}
      <div className="w-full h-10 bg-orange-500" id="strip">
        {/* Social Media Icons */}
        <div className="flex justify-center items-center h-full">
          <button
            onClick={() => handleSocialRedirect("facebook")}
            className="text-white mx-4 text-2xl"
          >
            <FaFacebook /> {/* Facebook Icon */}
          </button>
          <button
            onClick={() => handleSocialRedirect("youtube")}
            className="text-white mx-4 text-2xl"
          >
            <FaYoutube /> {/* YouTube Icon */}
          </button>
          <button
            onClick={() => handleSocialRedirect("instagram")}
            className="text-white mx-4 text-2xl"
          >
            <FaInstagram /> {/* Instagram Icon */}
          </button>
        </div>
      </div>
      <div className="mb-1">
        <NavbarWithSearch />
      </div>
      <div>
        <NavbarWithMegaMenu />
      </div>
      <div>
        {/* <VideoBackgroundWithText/> */}
        <CarouselCustom />
      </div>
      <div className="mt-10">
        <HomeContent />
      </div>
      <div className="mt-20">
        <VideoHomeComponent />
      </div>
      <div className="hide-scroll-bar">
        <AllProducts />
      </div>
      {/* <div className="">
        <h1 className="text-4xl text-center">We care about you</h1>
        <img src="https://vceela.com/web/image/146523-74d37b62/VCare_banner_900.png" alt="" className="mx-auto w-[70%]"/>
      </div> */}
      <div className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden mb-20 mt-20">
        {/* Video Background */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="https://videos.pexels.com/video-files/8157780/8157780-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
          autoPlay
          loop
          muted
        />

        {/* Overlay to darken the video */}
        <div className="absolute inset-0 bg-orange-400 opacity-40"></div>

        {/* Text Content */}
        <h1 className="relative text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 text-white drop-shadow-lg">
          Contemporary Fashion, Weekly Updates. Premium Quality and Timely
          Dispatch
        </h1>
      </div>

      <div className="">
        <FeaturedArtisans />
      </div>
      <div className="">
        <CustomerTestimonials />
      </div>

      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
