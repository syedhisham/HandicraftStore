import React from "react";
import { motion } from "framer-motion";

const FeaturedArtisans = () => {
  const artisans = [
    {
      id: 1,
      name: "Nabila Amir",
      location: "Lahore",
      image: "https://images.pexels.com/photos/18885576/pexels-photo-18885576/free-photo-of-gmy-wear-by-dhanno.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 2,
      name: "Ali Khan",
      location: "Karachi",
      image: "https://images.pexels.com/photos/10159244/pexels-photo-10159244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 3,
      name: "Zara Fatima",
      location: "Islamabad",
      image: "https://images.pexels.com/photos/18873681/pexels-photo-18873681/free-photo-of-sport-wear-by-dhanno.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      id: 4,
      name: "Shanza Jadoon",
      location: "Abbottabad",
      image: "https://images.pexels.com/photos/19292849/pexels-photo-19292849/free-photo-of-western-dress-2024-shoot-by-dhanno-mayra-jaffri.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];

  return (
    <div className="max-w-screen-4xl mx-auto my-10 p-5">
      <h1 className="text-3xl font-bold text-center mb-16">Featured Artisans</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {artisans.map((artisan, index) => (
          <motion.div
            key={artisan.id}
            className="flex flex-col items-center p-4 rounded-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <img
              src={artisan.image}
              alt={artisan.name}
              className="w-60 h-60 object-cover rounded-full border-4 mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">{artisan.name}</h2>
            <p className="text-gray-500">{artisan.location}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedArtisans;
