import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; 
import LoadingOverlay from "./LoadingOverlay";

function AllCategoryProducts({ productDetails = true, maxProducts }) {
  const [allProducts, setAllProducts] = useState([]); // Stores all fetched products
  const [filteredProducts, setFilteredProducts] = useState([]); // Stores products after filtering
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [subcategories, setSubcategories] = useState([]); // Stores unique subcategories
  const [selectedSubcategory, setSelectedSubcategory] = useState("all"); // Tracks selected subcategory
  const navigate = useNavigate(); 
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products/getAllProducts", {
          params: {
            page: currentPage,
            limit: 120, // Fetch a large batch to filter locally
          },
        });

        const products = response.data.data.docs;
        setAllProducts(products);

        // Extract subcategories from products
        const uniqueSubcategories = Array.from(
          new Set(products.map((product) => product.subcategory))
        );
        setSubcategories(["all", ...uniqueSubcategories]); // Include 'all' option

        filterProducts(products, searchQuery, "all"); // Apply initial filter
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage]);

  useEffect(() => {
    filterProducts(allProducts, searchQuery, selectedSubcategory); // Re-filter when search query or subcategory changes
  }, [searchQuery, selectedSubcategory]);

  const filterProducts = (products, query, subcategory) => {
    let filtered = products;

    // Filter by subcategory
    if (subcategory !== "all") {
      filtered = filtered.filter((product) => product.subcategory === subcategory);
    }

    // Filter by search query
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseQuery) ||
          product.description.toLowerCase().includes(lowerCaseQuery) ||
          product.category.toLowerCase().includes(lowerCaseQuery)
      );
    }

    setFilteredProducts(
      maxProducts ? filtered.slice(0, maxProducts) : filtered
    );
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory); // Update selected subcategory
    setCurrentPage(1); // Reset to first page when changing subcategory
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  const navigateToDetailedProduct = (productId) => {
    navigate(`/detailedProduct/${productId}`);
  };

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const handlePreviousPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Subcategory buttons */}
      {productDetails && 
        <div className="flex justify-center gap-4 mb-8">
        {subcategories.map((subcategory) => (
          <button
            key={subcategory}
            className={`px-4 py-2 rounded-lg ${
              selectedSubcategory === subcategory
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => handleSubcategoryChange(subcategory)}
          >
            {subcategory === "all" ? "All" : subcategory}
          </button>
        ))}
      </div>
      }


      {filteredProducts.length === 0 ? (
        <div className="text-center text-xl font-semibold text-gray-500">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="max-w-sm rounded-lg shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
            >
              <div
                className="h-56 bg-gray-200 rounded-t-lg overflow-hidden cursor-pointer"
                onClick={() => navigateToDetailedProduct(product._id)}
              >
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                    No Image Available
                  </div>
                )}
              </div>
              <div className="p-4 bg-white rounded-b-lg">
                <h3
                  className="text-xl font-semibold text-gray-800 mb-2 truncate cursor-pointer"
                  onClick={() => navigateToDetailedProduct(product._id)}
                >
                  {product.name}
                </h3>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-bold text-gray-900">Rs {product.price}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                </div>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                
                <p className="text-sm text-gray-600 mb-2">Delivery Time: {product.deliveryTime}</p>
                <div className="text-xs text-gray-500">
                  <p>
                    Owner: {product.ownerDetails.firstName} {product.ownerDetails.lastName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* <div className="flex justify-center gap-10 items-center mt-10">
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:bg-gray-300"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:bg-gray-300"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div> */}
    </div>
  );
}

export default AllCategoryProducts;
