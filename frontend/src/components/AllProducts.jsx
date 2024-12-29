import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomeRightBar from './HomeRightBar';
import LoadingOverlay from './LoadingOverlay';

const AllProducts = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [initialGroupedProducts, setInitialGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translateX, setTranslateX] = useState({});
  const [hoveredRows, setHoveredRows] = useState({});
  const [duplicatedProducts, setDuplicatedProducts] = useState({});
  const cardRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        let allProducts = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await axios.get(`/api/products/getAllProducts?page=${page}&limit=10`);
          const { docs, totalPages } = response.data.data;
          allProducts = [...allProducts, ...docs];

          if (page >= totalPages) {
            hasMore = false;
          } else {
            page++;
          }
        }

        const grouped = allProducts.reduce((acc, product) => {
          const { subcategory } = product;
          if (!acc[subcategory]) {
            acc[subcategory] = [];
          }
          acc[subcategory].push(product);
          return acc;
        }, {});

        setGroupedProducts(grouped);
        setInitialGroupedProducts(grouped); // Store the initial products for duplication
        setTranslateX(Object.keys(grouped).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})); // Initialize translation for each row
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    let slideInterval;

    // Slide products only if the row is not hovered
    slideInterval = setInterval(() => {
      if (cardRef.current) {
        const cardWidth = cardRef.current.offsetWidth;
        const spacing = 32;
        const slideWidth = cardWidth + spacing;

        setGroupedProducts((prevGroupedProducts) => {
          const updatedGroupedProducts = {};

          for (const subcategory in prevGroupedProducts) {
            if (!hoveredRows[subcategory]) {
              const products = [...prevGroupedProducts[subcategory]];

              // Slide one product at a time by popping the first product and pushing it to the end
              const firstProduct = products.shift();
              products.push(firstProduct); // Add it to the end

              updatedGroupedProducts[subcategory] = products;
            } else {
              updatedGroupedProducts[subcategory] = prevGroupedProducts[subcategory];
            }
          }
          return updatedGroupedProducts;
        });

        setTranslateX((prevTranslateX) => {
          const updatedTranslateX = { ...prevTranslateX };
          for (const subcategory in groupedProducts) {
            const products = groupedProducts[subcategory];
            if (products.length > 0 && !hoveredRows[subcategory]) {
              updatedTranslateX[subcategory] -= slideWidth;
              if (Math.abs(updatedTranslateX[subcategory]) >= slideWidth * products.length) {
                updatedTranslateX[subcategory] = 0; // Reset to the start position
              }
            }
          }
          return updatedTranslateX;
        });
      }
    }, 2000);

    return () => clearInterval(slideInterval);
  }, [groupedProducts, hoveredRows]);

  useEffect(() => {
    // Check if it's time to duplicate the products after the initial set has slid out of view
    Object.keys(groupedProducts).forEach((subcategory) => {
      const products = groupedProducts[subcategory];
      const lastProduct = products[products.length - 1];
      const lastProductPosition = translateX[subcategory] + products.length * (cardRef.current.offsetWidth + 32);

      if (Math.abs(translateX[subcategory]) >= lastProductPosition) {
        // Add the entire initial products after they have slid out of view
        const initialProducts = initialGroupedProducts[subcategory];
        if (!duplicatedProducts[subcategory]) {
          setDuplicatedProducts((prevDuplicated) => ({
            ...prevDuplicated,
            [subcategory]: initialProducts, // Add the whole set of initial products
          }));
        }
      }
    });
  }, [translateX, groupedProducts, initialGroupedProducts, duplicatedProducts]);

  const mergedGroupedProducts = Object.keys(groupedProducts).reduce((acc, subcategory) => {
    const initialProducts = initialGroupedProducts[subcategory] || [];
    const currentProducts = groupedProducts[subcategory] || [];
    const duplicateProducts = duplicatedProducts[subcategory] || [];
    acc[subcategory] = [...currentProducts, ...duplicateProducts];
    return acc;
  }, {});

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="p-5 w-full lg:w-3/4" id="allProducts">
        <h1 className="text-center text-3xl mb-12 ml-80  font-bold mt-20">All Products</h1>

        {Object.keys(mergedGroupedProducts).map((subcategory) => (
          <div key={subcategory} className="mb-10 flex flex-col lg:flex-row items-start">
            <div className="w-full lg:w-1/5">
              <h2 className="text-xl font-semibold mt-24">{subcategory}</h2>
            </div>

            <div className="w-full lg:w-4/5 overflow-x-scroll hide-scroll-bar">
              <div
                className="flex space-x-8 transition-transform duration-500"
                style={{
                  transform: `translateX(${translateX[subcategory]}px)`,
                }}
                onMouseEnter={() => setHoveredRows((prev) => ({ ...prev, [subcategory]: true }))} // Mark this row as hovered
                onMouseLeave={() => setHoveredRows((prev) => ({ ...prev, [subcategory]: false }))} // Mark this row as not hovered
              >
                {mergedGroupedProducts[subcategory].map((product, index) => (
                  <div
                    key={product._id}
                    ref={index === 0 ? cardRef : null} // Set ref on the first card only
                    className="bg-white shadow-lg w-80 flex-shrink-0"
                    onClick={() => navigate(`/detailedProduct/${product._id}`)}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-80 h-60 object-cover cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full lg:w-1/4 mt-32">
        <HomeRightBar />
      </div>
    </div>
  );
};

export default AllProducts;
