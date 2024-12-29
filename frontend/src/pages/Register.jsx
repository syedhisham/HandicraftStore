import React, { useState } from "react";
import axios from "axios";
import {
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "Male",
    password: "",
    role: "buyer", // Default role
    image: null, // New image field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if firstName or lastName starts with a number
    if (
      (name === "firstName" || name === "lastName") &&
      /^\d/.test(value)
    ) {
      setError(`${name === "firstName" ? "First" : "Last"} name should not start with a number.`);
    } else {
      setError(""); // Clear error if input is valid
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    console.log("This is image", e.target.files[0]); // Log to check if the file is being captured
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create a FormData object
    const data = new FormData();
    // Append form fields to FormData
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await axios.post("/api/users/register", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type
        },
      });
      SuccessToast("Registration Successful");
      // Reset form data
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        gender: "Male",
        password: "",
        role: "buyer",
        image: null,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);
      ErrorToast("Error registering user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="relative max-w-2xl mx-auto my-10 p-8 bg-white shadow-xl rounded-lg transform transition duration-500 hover:shadow-2xl">
      <ToastContainer />
      {loading && <LoadingOverlay />}
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Register
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="">
          <fieldset className="p-4 border rounded-md shadow-sm">
            <legend className="text-lg font-semibold text-gray-700 px-2">
              Personal Information
            </legend>
            <div className="mt-4">
              <Input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                variant="outlined"
                label="First Name"
                size="lg"
                color="orange"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className="mt-4">
              <Input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
                label="Last Name"
                size="lg"
                color="orange"
                placeholder="Enter your last name"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="mt-4">
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                label="Email"
                size="lg"
                color="orange"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mt-4">
              <Select
                label="Select Gender"
                id="gender"
                name="gender"
                size="lg"
                color="orange"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e })}
                required
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </div>
            <div className="mt-4">
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                label="Password"
                size="lg"
                color="orange"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="mt-4">
              <Select
                label="Select Role"
                id="role"
                name="role"
                size="lg"
                color="orange"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e })}
                required
              >
                <Option value="seller">Seller</Option>
                <Option value="buyer">Buyer</Option>
              </Select>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
              />
            </div>
          </fieldset>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 hover:shadow-xl transition duration-300"
        >
          Register
        </button>
        <p>Already have an account? <span onClick={handleLoginClick} className="cursor-pointer text-orange-500 underline">Login</span></p>
      </form>
    </div>
  );
};

export default Register;
