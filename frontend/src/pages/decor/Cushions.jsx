import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import LoadingOverlay from "../../components/LoadingOverlay";

function Cushions() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "/api/products/getAllProductsByCategory?page=${page}&limit=10",
          {
            params: { subcategory: "Cushions" },
          }
        );
        setProducts(response.data.data.docs); // Assuming paginated response
      } catch (error) {
        console.error("Error fetching Cushions products:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched or if there is an error
      }
    };

    fetchProducts();
  }, []);

  // Show loading spinner while data is being fetched
  if (loading) {
    return <LoadingOverlay />;
  }

  // Function to handle navigation to the detailedProduct page
  const navigateToDetailedProduct = (productId) => {
    navigate(`/detailedProduct/${productId}`); // Navigate with product ID
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* No products found message */}
      {products.length === 0 ? (
        <div className="text-center text-xl font-semibold text-gray-500">
          No products for this category.
        </div>
      ) : (
        // Grid Layout for Responsive Design
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="max-w-sm rounded-lg shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Product Image */}
              <div
                className="h-56 bg-gray-200 rounded-t-lg overflow-hidden cursor-pointer"
                onClick={() => navigateToDetailedProduct(product._id)} // Navigate on image click
              >
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]} // Display the first image in the array
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                    No Image Available
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4 bg-white rounded-b-lg">
                <h3
                  className="text-xl font-semibold text-gray-800 mb-2 truncate cursor-pointer"
                  onClick={() => navigateToDetailedProduct(product._id)} // Navigate on name click
                >
                  {product.name}
                </h3>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-bold text-gray-900">Rs {product.price}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                </div>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                
                <p className="text-sm text-gray-600 mb-2">Delivery Time: {product.deliveryTime}</p>
                <p className="text-sm text-gray-600 mb-2">SubCategory: {product.subcategory}</p>
                <div className="text-xs text-gray-500">
                  <p>
                    Owner: {product.ownerDetails.firstName} {product.ownerDetails.lastName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cushions;


Cushions
