import React from 'react';
import { motion } from 'framer-motion';

const HomeContent = () => {
  const collections = [
    {
      id: 1,
      title: 'Ceramic Art',
      description: 'Beautifully crafted ceramics for your home and decor needs.',
      image: 'https://images.pexels.com/photos/6909856/pexels-photo-6909856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: 2,
      title: 'Handwoven Textiles',
      description: 'Discover traditional patterns and vibrant colors in our textiles.',
      image: 'https://images.pexels.com/photos/6634278/pexels-photo-6634278.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: 3,
      title: 'Artisan Jewelry',
      description: 'Unique, handcrafted jewelry that tells a story.',
      image: 'https://images.pexels.com/photos/10474333/pexels-photo-10474333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: 4,
      title: 'Basketry',
      description: 'Handwoven baskets with intricate designs and durability.',
      image: 'https://images.pexels.com/photos/7575077/pexels-photo-7575077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: 5,
      title: 'Boxes & Jars',
      description: 'Decorative and functional storage solutions for every space.',
      image: 'https://images.pexels.com/photos/6334660/pexels-photo-6334660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: 6,
      title: 'Bangles',
      description: 'Elegant handcrafted bangles to complement your style.',
      image: 'https://images.pexels.com/photos/9808451/pexels-photo-9808451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: 7,
      title: 'Necklaces',
      description: 'Exquisite necklaces crafted with precision and care.',
      image: 'https://images.pexels.com/photos/10491415/pexels-photo-10491415.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id: 8,
      title: 'Hats & Caps',
      description: 'Stylish hats and caps for all seasons.',
      image: 'https://images.pexels.com/photos/8201150/pexels-photo-8201150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ];

  return (
    <div>
      {/* Image Gallery */}
      <div className="py-12 px-4 md:px-12">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Explore Our Handcrafted Collections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((item, index) => (
            <motion.div
              key={item.id}
              className="overflow-hidden rounded-lg shadow-lg"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeContent;
