import React, { useState, useEffect } from "react";
import axios from "axios";

const HighRatedProducts = () => {
  const [products, setProducts] = useState([]); // Ensure it's an array by default
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighRatedProducts = async () => {
      try {
        const response = await axios.get("/api/products/getRatedProductStats", {
          params: { rating: "high" },
        });

        if (response.data && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          console.error("Error: API response does not contain products as an array", response.data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching High-rated products", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHighRatedProducts();
  }, []);

  if (loading) {
    return <div>Loading High Rated Products...</div>;
  }

  if (!Array.isArray(products) || products.length === 0) {
    return <div>No High-rated products found.</div>;
  }

  const highRatedProducts = products.filter(
    (product) => product.averageRating >= 3 && product.averageRating <= 5
  );

  if (highRatedProducts.length === 0) {
    return <div>No products with a rating less than 3 found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-10">High Rated Products</h1>
    <div className="grid grid-cols-3 gap-6">
      {highRatedProducts.map((product) => {
        const rating = product.averageRating || 0; // Default to 0 if averageRating is null
        const stars = Array(5).fill(false).map((_, index) => index < rating); // Fill stars dynamically
        
        return (
          <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Card Header with Product Image */}
            <div className="h-48 bg-gray-200">
              <img
                src={product.images[0]} // Access the first image from the images array
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Card Body with Product Details */}
            <div className="p-4">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-lg font-bold mt-2">{`Rs ${product.price}`}</p>
              <p className="text-sm text-gray-500">{`Availability: ${product.stock}`}</p>
              <div className="flex items-center mt-2">
                {/* Render stars based on the rating */}
                {stars.map((isFilled, index) => (
                  <span key={index} className={`text-xl ${isFilled ? "text-yellow-500" : "text-gray-300"}`}>
                    ★
                  </span>
                ))}
                <span className="text-gray-500 ml-2">{rating} / 5</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
};

export default HighRatedProducts;
