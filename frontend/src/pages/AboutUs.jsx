import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6 sm:p-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-12">
          About Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              Who We Are
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to CraftedTreasure, your ultimate destination for unique and
              handcrafted products. We are passionate about connecting talented
              artisans with customers who value creativity and quality.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our platform celebrates the artistry of skilled craftspeople,
              offering a wide range of handmade items designed to bring
              authenticity and charm into your life.
            </p>
          </div>

          {/* Right Section */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1690541478715-898f26cbc28d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="About Us"
              className="rounded-lg shadow-md w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Core Values */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To empower artisans by providing a platform to showcase their
              skills and make their creations accessible to a global audience.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Our Vision
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To create a sustainable ecosystem that values craftsmanship,
              fosters creativity, and promotes cultural heritage.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Our Values
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Integrity, quality, and innovation are the cornerstones of
              everything we do.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Join Our Community
          </h2>
          <p className="text-gray-600 mb-6">
            Be part of a movement that values creativity and craftsmanship.
            Explore, create, and inspire with ArtisanalAura.
          </p>
          <Link to={"/contactUs"}>
          <button className="bg-orange-500 text-white py-3 px-6 rounded-lg shadow-md hover:orange-blue-600 transition duration-300">
            Contact Us
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;