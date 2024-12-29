import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingOverlay from "../components/LoadingOverlay";
import ErrorToast from "../components/ErrorToast";
import SuccessToast from "../components/SuccessToast";
import { Button } from "@material-tailwind/react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) {
        setError("User ID not found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/api/cart/get-cart/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data && response.data.data) {
          const items = response.data.data.items || [];
          setCartItems(items);
          setError(null);
        } else {
          setCartItems([]);
          setError("Unexpected response structure");
        }
      } catch (error) {
        setError("Failed to fetch cart items");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId]);

 

  const handleDeleteItem = async (productId) => {
    try {
      await axios.delete(
        `/api/cart/delete-item/user/${userId}/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      SuccessToast("Item removed");

      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter(
          (item) => item.product !== productId
        );
        if (updatedItems.length === 0) {
          setError(null);
        }
        return updatedItems;
      });
    } catch (error) {
      setError("Failed to delete item from cart");
      ErrorToast("Failed to delete item from cart");
      console.error(error);
    }
  };

  const handleUpdateItem = (item) => {
    navigate(`/detailedProduct/${item}`, {
    });
  };

  const handleCheckout = () => {
    navigate(`/checkout`);
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="max-w-screen-2xl mx-auto p-5">
      {error && <div className="text-center p-5 text-red-500">{error}</div>}
      <h1 className="text-3xl font-semibold mb-5 text-center">Your Cart</h1>

      {cartItems.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {cartItems.map((item, index) => (
            <div
              key={`${item.product}-${index}`} // Use product ID as key
              className="flex flex-col sm:flex-row justify-center items-start border border-orange-300 p-4 rounded-lg shadow-md bg-white"
            >
              {item.images.length > 0 && (
                <img
                  src={item.images[0]} // Accessing the image from item.images
                  alt={item.name} // Using the name for alt text
                  className="w-36 h-36 object-cover rounded mr-4 mb-4 sm:mb-0"
                />
              )}
              <div className="flex flex-col flex-grow justify-center mt-2">
                <div className="flex gap-5 items-center">
                  <h2 className="text-xl font-semibold mb-1">
                    {item.name.toUpperCase()} {/* Accessing product name */}
                  </h2>
                </div>

                <p className="font-semibold text-gray-700 text-sm">
                  Quantity:
                  <span className="font-normal"> {item.quantity}</span>
                </p>
                <p className="text-gray-700 font-bold mt-2">
                  Price: Rs {item.price * item.quantity} {/* Using price directly */}
                </p>
              </div>

              <div className="flex flex-col my-auto space-y-2 sm:ml-4">
                <Button
                  variant="text"
                  color="orange"
                  onClick={() =>
                    handleUpdateItem(item.product, item.size, item.color)
                  }
                  className="border"
                >
                  Update
                </Button>
                <Button
                  variant="text"
                  color="orange"
                  onClick={() => handleDeleteItem(item.product)}
                  className="border"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-orange-500">Your cart is empty.</div>
      )}

      {cartItems.length > 0 && (
        <div className="text-right mt-6">
          <Button
            onClick={handleCheckout}
            className="bg-orange-800 text-white px-6 py-3 rounded hover:bg-orange-900 transition-all duration-300 ease-in-out"
          >
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
