import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Select, Option, Textarea } from "@material-tailwind/react";
import ErrorToast from "../components/ErrorToast";
import LoadingOverlay from "../components/LoadingOverlay";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Debit Card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false); // To track if the order is submitted
  const [sessionId, setSessionId] = useState('');
  const [status, setStatus] = useState(null);  // Payment status
  const token = localStorage.getItem("token");
  console.log('amount',cartItems.price);


console.log('Cart Items',cartItems);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();


  useEffect(() => {
    // Check if there are saved order details in localStorage
    const savedOrderDetails = localStorage.getItem('orderDetails');
    
    if (savedOrderDetails) {
      const { cartItems: savedCartData, shippingAddress: savedShippingAddress, paymentMethod: savedPaymentMethod } = JSON.parse(savedOrderDetails);
      
      // Restore cartData, formData, and paymentMethod from localStorage
      setCartItems(savedCartData);
      setShippingAddress(savedShippingAddress);
      setPaymentMethod(savedPaymentMethod);
  
      // Clear the saved data from localStorage after it's retrieved
      localStorage.removeItem('orderDetails');
    }
  }, []);

  useEffect(() => {
    // Check if the URL has 'payment-cancelled' parameter without any value
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const paymentCancelled = urlParams.has('payment-cancelled');  // Check if 'payment-cancelled' exists
  
    // If 'payment-cancelled' is present, clear the local storage
    if (paymentCancelled) {
      localStorage.removeItem('orderDetails');
      setPaymentMethod("");
      console.log("Order details removed from localStorage due to payment cancellation");
    }
  }, []);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
  
    if (sessionId) {
      axios.get(`/api/session/session-status?session_id=${sessionId}`,{
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          const { status} = response.data;
          setStatus(status);
        })
        .catch((error) => {
          console.error('Error fetching session status:', error);
          // ErrorToast(error.response.data.message);
        });
    }
  }, []);

  useEffect(() => {
    if (status === 'complete' && !isOrderSubmitted) {
      const sessionId = new URLSearchParams(window.location.search).get('session_id');
  
      if (sessionId) {
        completeSession(sessionId); // Only sets sessionId
      } else {
        ErrorToast('Session ID not found!');
      }
    }
  }, [status, isOrderSubmitted]);

  useEffect(() => {
    if (sessionId && status === 'complete' && !isOrderSubmitted) {
      // Proceed to handle the order only if sessionId is set
      if (cartItems.items?.length > 0 && shippingAddress && paymentMethod) {
        handleCheckout();
        setIsOrderSubmitted(true); // Mark the order as submitted
      }
    }
  }, [sessionId, status, shippingAddress, paymentMethod, isOrderSubmitted]);
  

   // The completeSession function can be modified to return a promise
   const completeSession = async (sessionId) => {
    try {
      const response = await axios.post('/api/session/complete-session', {
        session_id: sessionId,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Session completed:', response.data.message);
      setSessionId(sessionId);
    } catch (error) {
      console.error('Error completing session:', error.response.data.message);
      ErrorToast(error.response.data.message);
    }
  };
  

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`/api/cart/get-cart/user/${userId}`);
        const items = response.data.data.items || [];
        // setCartItems(items);

        // Calculate totalAmount directly from item price and quantity
        const total = items.reduce(
          (sum, item) => sum + item.price * item.quantity, 0
        );
        setTotalAmount(total);
        setCartItems({ items, price:total });
      } catch (err) {
        setError("Failed to fetch cart items");
      }
    };

    fetchCartItems();
  }, [userId]);

  const handleCheckout = async () => {
    if (!shippingAddress || !paymentMethod) {
      setError("Please fill out shipping address and select a payment method.");
      return;
    }
    if (paymentMethod === 'Debit Card' && !sessionId) {
      ErrorToast('Session ID is required for Debit Card payments. Please complete the payment process.');
      return;
    }

    setLoading(true); // Show loading overlay
    setError(null);

    try {
      const orderData = {
        user: userId,
        products: cartItems.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        totalAmount: cartItems.price,
        paymentMethod,
        shippingAddress,
        sessionId,
      };

      const response = await axios.post("/api/orders/create", orderData);
      if (response.status === 201) {
        const orderId = response.data.data._id;
        // Simulate loading delay for a better user experience
        setTimeout(() => {
          navigate(`/orderConfirmation/${orderId}`, {
            state: {
              totalAmount,
              paymentMethod,
              shippingAddress,
              cartItems,
            },
          });
        }, 1000); // Adjust delay as needed
      }
    } catch (error) {
      setError("Failed to place the order. Please try again.");
    } finally {
      setLoading(false); // Hide loading overlay
    }
  };

  const handlePaymentWithStripe = async()=>{
    // Save cart data and form data to localStorage
    if ( !shippingAddress || !paymentMethod) {
      ErrorToast('Please fill in all the fields.');
      return;
    }
  localStorage.setItem('orderDetails', JSON.stringify({
    cartItems,
    shippingAddress,
    paymentMethod,
  }));
    const sessionResponse = await axios.post('/api/session/create-checkout-session', {
      amount: cartItems.price,
    },{
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const { sessionId } = sessionResponse.data;

    // Redirect to the Stripe Checkout page
    const stripe = window.Stripe("pk_test_51QbNGkGAMu5UjAbaQoMlWEhZbBiOaQC8FQDQVDkF7qbm4ORn3NBzsMLjLlPE2q4I9J9LxYAmvUxtypl3zQ55VajV009DGIZquL"); // Your Stripe public key
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error('Error redirecting to Stripe Checkout:', error);
      ErrorToast('Payment failed. Please try again.');
    }
  }

  return (
    <div className="checkout-container max-w-screen-sm mx-auto p-5 mb-10">
      {loading && <LoadingOverlay />} {/* Show loading overlay */}
      <h1 className="text-3xl font-semibold mb-8 text-center">Checkout</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
        <Textarea
          variant="outlined"
          label="Shipping Address"
          type="text"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          className="w-full mb-3"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <Select
          label="Payment Method"
          value={paymentMethod}
          onChange={(value) => setPaymentMethod(value)}
          className="w-full mb-3"
        >
          <Option value="Debit Card">Debit Card</Option>
          <Option value="Cash on Delivery" >Cash on Delivery</Option>
        </Select>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {cartItems.items?.map((item, index) => (
  <div
    key={`${item.product}-${index}`} // Using product ID for key
    className="flex justify-between mb-2"
  >
    <span>{item.name}</span>
    <span>Rs {item.price * item.quantity}</span>
  </div>
))}
        <div className="flex justify-between font-semibold text-lg mt-4">
          <span>Total:</span>
          <span>Rs {totalAmount}</span>
        </div>
      </div>

      {/* <Button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full bg-orange-800 text-white py-3 rounded hover:bg-orange-900 transition-all duration-300 ${
          loading && "opacity-50 cursor-not-allowed"
        }`}
      >
        {loading ? "Processing..." : "Place Order"}
      </Button> */}
          {paymentMethod === "Debit Card" ? (
    <Button onClick={handlePaymentWithStripe}
      className='w-full bg-orange-800 text-white py-3 rounded hover:bg-orange-900 transition-all duration-300'>Go to Payment</Button> // Show "Go to Payment" button for Debit Card
  ) : (
    <Button disabled={!paymentMethod}        
    //  disabled={loading}
    className={`w-full bg-orange-800 text-white py-3 rounded hover:bg-orange-900 transition-all duration-300 ${
      loading && "opacity-50 cursor-not-allowed"
    }`} onClick={handleCheckout}>{loading ? "Processing..." : "Place Order"}</Button> // Show "Complete Order" button for other payment methods
  )}
    </div>
  );
};

export default Checkout;
