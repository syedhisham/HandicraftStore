import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@material-tailwind/react";
import ReviewsOnProduct from "./ReviewsOnProduct";
import SuccessToast from "./SuccessToast";
import ErrorToast from "./ErrorToast";
import Popup from "./Popup"; // Import Popup component
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import AllCategoryProducts from "./AllCategoryProducts";

const DetailedProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios
      .get(`/api/products/productById/${productId}`)
      .then((response) => {
        const fetchedProduct = response.data.data;
        setProduct(fetchedProduct);
        setMainImage(fetchedProduct.images[0]);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch product details");
        setLoading(false);
      });
  }, [productId]);

  const handleAddToCart = async () => {
    if (!userId || !productId) {
      // Show the popup if user is unauthorized
      setIsPopupOpen(true);
      return;
    }

    const cartData = {
      quantity,
    };

    try {
      const response = await axios.post(
        `/api/cart/create-cart/user/${userId}/product/${productId}`,
        cartData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      SuccessToast("Item added to cart");
    } catch (error) {
      console.error("Error adding item to cart", error);
      ErrorToast("Error adding item to cart");
    }
  };

  const getStockDetails = (stock) => {
    if (stock < 10) {
      return {
        text: "Stock is running low! Hurry up before it’s gone!",
        color: "red-500",
        circleColor: "red-500",
      };
    } else if (stock >= 10 && stock < 25) {
      return {
        text: "Stock is limited. Order soon!",
        color: "orange-500",
        circleColor: "orange-500",
      };
    } else {
      return {
        text: "In stock. Ready for delivery!",
        color: "green-500",
        circleColor: "green-500",
      };
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false); // Close the popup
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center text-red-500">
        {error}
      </div>
    );
  }

  const { stock } = product;
  const stockDetails = getStockDetails(stock);

  return (
    <div>
      <div className="p-5 container mx-auto">
        <div className="flex flex-col md:flex-row gap-10 mt-16">
          <div className="md:w-1/2">
            <motion.div
              className="relative w-full h-[40rem] border-2 border-gray-300 rounded-md overflow-hidden"
              onMouseEnter={() => setZoom(true)}
              onMouseMove={(e) => {
                const rect = e.target.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setZoomStyle({
                  transformOrigin: `${x}% ${y}%`,
                  transform: "scale(2)",
                });
              }}
              onMouseLeave={() => {
                setZoom(false);
                setZoomStyle({});
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={mainImage}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  zoom ? "cursor-zoom-in" : ""
                }`}
                style={zoom ? zoomStyle : {}}
              />
            </motion.div>
            <div className="flex mt-4 space-x-4 overflow-x-scroll hide-scroll-bar">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover border-2 cursor-pointer rounded-md ${
                    mainImage === image ? "border-blue-500" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(image)}
                />
              ))}
            </div>
          </div>

          <motion.div
            className="md:w-1/2 p-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {product.name}
            </h2>
            <p className="text-xl text-gray-700 mb-4">
              <strong>Price:</strong>{" "}
              <span className="text-green-600">Rs {product.price}</span>
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Description:</strong> {product.description}
            </p>
            <div className="flex items-center mb-6">
              <span
                className={`w-3 h-3 rounded-full bg-${stockDetails.circleColor} mr-2`}
              ></span>
              <p className={`text-${stockDetails.color}`}>
                {stockDetails.text}
              </p>
            </div>
            <div className="flex flex-col gap-y-6 mb-6">
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p>
                <strong>Subcategory:</strong> {product.subcategory}
              </p>
              <p>
                <strong>Delivery Time:</strong> {product.deliveryTime} days
              </p>
              <p>
                <strong>Owner:</strong> {product.ownerDetails.firstName}{" "}
                {product.ownerDetails.lastName}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-md overflow-hidden">
                <Button
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                >
                  -
                </Button>
                <input
                  type="number"
                  className="w-12 text-center outline-none"
                  value={quantity}
                  readOnly
                />
                <Button
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </Button>
              </div>
              <Button
                className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 transition duration-300"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="mt-5 mb-5">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Rating and Reviews
          </h2>
          <ReviewsOnProduct productId={productId} />
        </div>
        <div className="mt-10 mb-10">
          <h2 className="text-2xl font-bold text-gray-700 text-center my-6 tracking-wider">
            You May Also Like
          </h2>

          <AllCategoryProducts productDetails={false} maxProducts={8} />
        </div>
      </div>
      <ToastContainer />

      {/* Popup Component */}
      <Popup
        isOpen={isPopupOpen}
        message="You need to log in to perform this activity."
        onClose={handlePopupClose}
      />
    </div>
  );
};

export default DetailedProduct;
