import React, { useState } from "react";
import { Button, Input, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/users/login", formData);
      const { user, token } = response.data.data;
      const userId = user._id;
      localStorage.setItem("userId", userId);
      localStorage.setItem("token", token);

      SuccessToast("Login successful!");
      setFormData({ email: "", password: "" });

      // Redirect based on user role
      if (user.role === "buyer") {
        navigate("/");
      } else if (user.role === "seller") {
        navigate("/adminPanel");
      } else if (user.role === "admin") {
        navigate("/adminPanel");
      }
    } catch (error) {
      console.error(error);
      ErrorToast("Error logging in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md p-6 bg-white transform transition duration-500 hover:shadow-2xl">
        <Typography variant="h4" className="text-center mb-6">
          Log In
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            variant="outlined"
            size="lg"
            color="orange"
            placeholder="Enter your email"
            required
          />
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            label="Password"
            variant="outlined"
            size="lg"
            color="orange"
            placeholder="Enter your password"
            required
          />
          <p className="text-sm mt-1">
            Forgot your password?{" "}
            <Link
              to={"/forgotPassword"}
              className="text-orange-500 underline hover:text-orange-700 transition-colors duration-200 ease-in-out"
            >
              Reset it here
            </Link>
          </p>

          <Button
            type="submit"
            className="w-full py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700  transition duration-300"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-orange-600 border-t-transparent border-solid rounded-full animate-spin"></div>
              </div>
            ) : (
              "Log In"
            )}
          </Button>
          <p>
            Don't have an account?{" "}
            <span
              onClick={handleRegisterClick}
              className="cursor-pointer text-orange-500 underline"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
