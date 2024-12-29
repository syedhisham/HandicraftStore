import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SuccessToast from "../components/SuccessToast";
import ErrorToast from "../components/ErrorToast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingOverlay from "../components/LoadingOverlay";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    stock: "",
    deliveryTime: "",
    specifications: "",
    image: "",
  });
  const [categories] = useState({
    Craft: ["Blue Pottery", "Ceramics & Pottery", "Basketry", "Camel Skin", "Wood Craft", "Ajrak", "Khussa"],
    Decor: ["Paintings", "Boxes & Jars", "Lamps", "Furniture", "Rugs & Carpets", "Cushions", "Tissue Box Covers"],
    Apparel: ["Scarfs & Shawls", "Unstitched Fabric", "Hats & Caps", "Sweaters, Coats & Uppers", "Dresses",],
    Accessories: ["Clutches & Wristlets", "Bangles", "Necklaces", "Gloves & Mitts"],
  }); // Placeholder categories and subcategories
  const [subcategories, setSubcategories] = useState([]);
  const [images, setImages] = useState([]);
  const [specifications, setSpecifications] = useState([]);

  useEffect(() => {
    if (formData.category) {
      setSubcategories(categories[formData.category] || []);
    }
  }, [formData.category, categories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };
  const handleAddSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecifications = [...specifications];
    updatedSpecifications[index][field] = value;
    setSpecifications(updatedSpecifications);
  };

  const handleRemoveSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const specificationsMap = {};
    specifications.forEach((spec) => {
      if (spec.key && spec.value) {
        specificationsMap[spec.key] = spec.value;
      }
    });
  
    const formDataToSend = new FormData();
  
    // Append other form data
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("subcategory", formData.subcategory);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("deliveryTime", formData.deliveryTime);
  
    // Append specifications as a JSON string
    formDataToSend.append("specifications", JSON.stringify(specificationsMap));
  
    // Append images
    images.forEach((image) => {
      formDataToSend.append("images", image);
    });
  
    try {
      const response = await axios.post("/api/products/addProduct", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      SuccessToast("Added Successfuly");
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        subcategory: "",
        stock: "",
        deliveryTime: "",
      });
      setSpecifications([{ key: "", value: "" }]);
      setImages([]);
    } catch (error) {
      ErrorToast("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-xl rounded-lg transform transition duration-500 hover:shadow-2xl">
      {loading && <LoadingOverlay />}
      
      <h2 className="text-xl font-bold text-gray-800 mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-orange-500"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-orange-500"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-orange-500"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-orange-500"
          >
            <option value="">Select a category</option>
            {Object.keys(categories).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Subcategory
          </label>
          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-orange-500"
          >
            <option value="">Select a subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Stock
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-orange-500"
          />
        </div>

        {/* Delivery Time */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Delivery Time
          </label>
          <input
            type="text"
            name="deliveryTime"
            value={formData.deliveryTime}
            onChange={handleInputChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-orange-500"
          />
        </div>

        {/* Specifications */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Specifications
          </label>
          {specifications.map((spec, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Key (e.g., Material)"
                value={spec.key}
                onChange={(e) =>
                  handleSpecificationChange(index, "key", e.target.value)
                }
                className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-orange-500"
              />
              <input
                type="text"
                placeholder="Value (e.g., Cotton)"
                value={spec.value}
                onChange={(e) =>
                  handleSpecificationChange(index, "value", e.target.value)
                }
                className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveSpecification(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSpecification}
            className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Add Specification
          </button>
        </div>

        {/* Images */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Images
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="mt-1 block w-full"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 focus:outline-none focus:ring focus:ring-orange-300"
          >
            Add Product
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddProduct;
