import React from 'react';
import pkMap from '../assets/pkmap.png'
import mapLegend from '../assets/mapLegend.png'

const CraftsMap = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Crafts Map of Pakistan</h1>
        <p className="text-lg text-gray-600 mt-2">The detailed map shows the crafts of every region of the country.</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-center gap-4">
        {/* Left Image */}
        <div className="flex justify-center w-full md:w-1/3">
          <img
            src={pkMap}
            alt="Crafts Map Left"
            className="object-contain max-w-full h-auto"
          />
        </div>
        
        {/* Right Image */}
        <div className="flex justify-center w-full md:w-1/3">
          <img
            src={mapLegend}
            alt="Crafts Map Right"
            className="object-contain max-w-full h-2/3"
          />
        </div>
      </div>
    </div>
  );
};

export default CraftsMap;
