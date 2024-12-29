import React, { useEffect, useState } from "react";
import axios from "axios";
import SuccessToast from "./SuccessToast";
import ErrorToast from "./ErrorToast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingOverlay from "./LoadingOverlay";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});
  const [actionLoading, setActionLoading] = useState(false); 
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    stock: "",
    deliveryTime: "",
  });
  const [specifications, setSpecifications] = useState([]); // Array for key-value pairs
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/products/myProducts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProducts(data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleUpdateClick = (product) => {
    setCurrentProduct(product);
    setFormData(product);
    setSpecifications(Object.entries(product.specifications || {}));
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSpecificationChange = (index, key, value) => {
    const newSpecifications = [...specifications];
    newSpecifications[index] = [key, value];
    setSpecifications(newSpecifications);
  };

  const addSpecificationField = () => {
    setSpecifications([...specifications, ["", ""]]);
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      specifications.forEach(([key, value]) => {
        if (key) formDataToSend.append(`specifications[${key}]`, value);
      });

      images.forEach((image) => formDataToSend.append("images", image));

      await axios.put(
        `/api/products/updateProduct/${currentProduct._id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      SuccessToast("Product Updated Successfuly")

      setProducts(
        products.map((p) =>
          p._id === currentProduct._id ? { ...p, ...formData } : p
        )
      );
      setShowModal(false);
    } catch (err) {
      ErrorToast(err.response?.data?.message || "Failed to update product");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setActionLoading(true);
      try {
        await axios.delete(`/api/products/deleteProduct/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        SuccessToast("Product deleted successfully");
        setProducts(products.filter((product) => product._id !== productId));
      } catch (err) {
        ErrorToast(err.response?.data?.message || "Failed to delete product");
      }
      finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Manage Products</h1>

      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="w-[90%] bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 duration-300">
              <img
                src={product.images[0] || "/placeholder-image.jpg"}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-gray-600">Rs {product.price}</p>
                <p className="text-gray-500">Stock: {product.stock}</p>
                <div className="flex gap-4 justify-between mt-4 items-end">
                  <button
                    onClick={() => handleUpdateClick(product)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {actionLoading && <LoadingOverlay />}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4">Update Product</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border p-2 mb-4"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border p-2 mb-4"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border p-2 mb-4"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border p-2 mb-4"
              />
              <input
                type="text"
                name="subcategory"
                placeholder="Subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="w-full border p-2 mb-4"
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full border p-2 mb-4"
              />
              <input
                type="text"
                name="deliveryTime"
                placeholder="Delivery Time"
                value={formData.deliveryTime}
                onChange={handleInputChange}
                className="w-full border p-2 mb-4"
              />

              <h3 className="text-lg font-bold">Specifications</h3>
              {specifications.map(([key, value], index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Key"
                    value={key}
                    onChange={(e) =>
                      handleSpecificationChange(index, e.target.value, value)
                    }
                    className="w-1/2 border p-2"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={value}
                    onChange={(e) =>
                      handleSpecificationChange(index, key, e.target.value)
                    }
                    className="w-1/2 border p-2"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addSpecificationField}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Add Specification
              </button>

              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="w-full border p-2 mb-4"
              />

              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      <ToastContainer/>
    </div>
  );
};

export default ManageProducts;
