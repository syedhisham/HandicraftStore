import React from 'react';
import { motion } from 'framer-motion';

const HomeRightBar = () => {
  const sections = [
    {
      title: "Artist of the Week",
      imgSrc: "https://vceela.com/web/image/218284-03d612cc/vceela_nabila_aamir_512.jpg",
      altText: "Artist of the Week",
      details: ["Nabila Amir", "Craft", "Lahore"],
    },
    {
      title: "Deal of the Day",
      imgSrc: "https://vceela.com/web/image/218376-c2633a65/sale%20%283%29.png",
      altText: "Deal of the Day",
      details: ["Skill"],
    },
    {
      title: "Crafts Maps of Pakistan",
      imgSrc: "https://images.pexels.com/photos/5403291/pexels-photo-5403291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      altText: "Crafts Maps of Pakistan",
      details: ["Name"],
    },
  ];

  return (
    <div className="border-l-2 border-orange-500 lg:border-dashed p-5 my-auto space-y-8 ml-10">
      {sections.map((section, index) => (
        <motion.div
          key={index}
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h1 className="text-lg font-semibold text-orange-600">{section.title}</h1>
          <img
            className="w-80 h-60 object-cover rounded-lg shadow-lg mx-auto"
            src={section.imgSrc}
            alt={section.altText}
          />
          {section.details.map((detail, idx) => (
            <p key={idx} className={`text-${idx === 0 ? "xl font-bold" : "gray-600"}`}>
              {detail}
            </p>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default HomeRightBar;
