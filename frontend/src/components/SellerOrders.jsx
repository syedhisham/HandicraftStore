import React, { useEffect, useState } from "react";
import axios from "axios";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/orders/getAllOrders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
          },
        });
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p>No orders found for this seller.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6">
      {orders.map((order) => (
        <div
          key={order._id}
          className="w-80 bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 duration-300"
        >
          <div className="relative">
            <img
              src={
                order.products[0]?.productDetails?.images[0] ||
                "/placeholder-image.jpg"
              }
              alt={order.products[0]?.productName || "Product"}
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">
              Order ID: {order._id}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              Total Amount: Rs {order.totalAmount}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Status: {order.status}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Payment Method: {order.paymentMethod}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Shipping Address: {order.shippingAddress}
            </p>
            <div className="mt-4">
              <h3 className="text-lg font-bold mb-2">Products:</h3>
              {order.products.map((product, index) => (
                <div key={index} className="mb-4">
                  <p className="text-sm text-gray-600">
                    Product Name: {product.productName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {product.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SellerOrders;
