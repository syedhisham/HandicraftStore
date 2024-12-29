import React, { useState } from "react";
import axios from "axios";
import { Input } from "@material-tailwind/react";
import ErrorToast from "../components/ErrorToast";
import SuccessToast from "../components/SuccessToast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/users/forgotPassword", { email });
      // Display success toast
      SuccessToast("Reset Link sent successfuly!");
    } catch (err) {
      // Display error toast
      ErrorToast(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div>
            <Input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Enter your email"
              className="border-2 focus:bg-orange-50 focus:ring-0 text-base"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="max-w-full w-full bg-orange-500 hover:bg-orange-700 transition-colors duration-300 ease-in-out m-auto cursor-pointer text-white text-xl font-medium text-center py-2 rounded-full"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
