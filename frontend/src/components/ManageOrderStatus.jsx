import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, IconButton } from "@material-tailwind/react";
import { CiSearch } from "react-icons/ci";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorToast from "./ErrorToast";
import SuccessToast from "./SuccessToast";

const ManageOrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State to store search term
  const [filteredOrders, setFilteredOrders] = useState([]); // State to store filtered orders
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to toggle search input visibility

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/orders/getAllOrders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrders(data);
        setFilteredOrders(data); // Initialize filteredOrders with all orders
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = orders.filter((order) =>
      order._id.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      // Send status change to backend
      await axios.put(
        "/api/orders/updateOrderStatus",
        { orderId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      // Refetch orders after updating the status
      const { data } = await axios.get("/api/orders/getAllOrders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(data);
      setFilteredOrders(data); // Update filtered orders after fetching new data

      SuccessToast("Order status updated successfully.");
    } catch (error) {
      console.error("Error updating order status:", error);
      ErrorToast("Failed to update order status.");
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      {/* Search bar */}
      <div className="my-4 flex items-center">
        <IconButton
          className="mt-4"
          variant="outlined"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          <CiSearch
            className="cursor-pointer text-gray-600 transition-transform duration-300 hover:scale-110"
            style={{ color: "black", fontSize: "2.5em" }}
            size={24}
          />
        </IconButton>

        <div
          className={`transition-all duration-500 ease-in-out ml-2 pt-5 overflow-hidden ${isSearchOpen ? "w-full" : "w-0"}`}
        >
          <Input
            variant="standard"
            type="text"
            label="Search by Order ID"
            placeholder="Search by order ID"
            value={searchTerm}
            onChange={handleSearch}
            className={`pl-4 pr-4 py-2 w-full shadow-sm transition duration-300 transform ${isSearchOpen ? "scale-100" : "scale-0"}`}
          />
        </div>
      </div>

      {/* Display orders */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {filteredOrders.map((order) => {
          const firstProduct = order.products[0]?.product;

          return (
            <div key={order._id} className="w-[90%] bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 duration-300">
              {/* Render the first product image if it exists */}
              {console.log(order.products[0]?.productDetails.images[0])} 

              {firstProduct?.images?.[0] && (
                <img
                src={
                  order.products[0]?.productDetails?.images[0] ||
                  "/placeholder-image.jpg"
                }
                  alt={order.products[0].productName}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h2 className="text-xl font-semibold">{`Order ID: ${order._id}`}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  Total Amount: Rs {order.totalAmount}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Current Status: {order.status}
                </p>

                {/* Update status dropdown */}
                <label htmlFor={`status-${order._id}`} className="block mb-2 font-semibold">
                  Update Status:
                </label>
                <select
                  id={`status-${order._id}`}
                  className="border border-gray-300 p-2 rounded w-full"
                  value={order.status} // Ensure the selected value remains the current status
                  onChange={(e) => handleStatusChange(order._id, e.target.value)} // Update status on change
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Footer to display the products */}
              <div className="p-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Products:</h3>
                <ul>
                  {order.products.map((product, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      <p>{product.productName}</p>
                      <p>Quantity: {product.quantity}</p>
                      <p>Price: Rs {product.price}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <ToastContainer />
    </div>
  );
};

export default ManageOrderStatus;
