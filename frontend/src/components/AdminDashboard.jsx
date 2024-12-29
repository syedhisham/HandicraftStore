import React, { useState, useEffect } from "react";
import { FaUsers, FaChartLine } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import { AiFillProduct } from "react-icons/ai";
import { PiListStarFill } from "react-icons/pi";
import { FcShop } from "react-icons/fc";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [userRole, setUserRole] = useState("");
  const [totalSales, setTotalSales] = useState(null);

  // Fetch user role and other stats
  useEffect(() => {
    const fetchUserRoleAndStats = async () => {
      try {
        const roleResponse = await axios.get("/api/users/getUserRole", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        const role = roleResponse.data.data.toLowerCase();
        setUserRole(role);
  
        if (role === "admin") {
          // Fetch additional stats for admin (users and active users)
          const statsResponse = await axios.get("/api/users/getUserStats", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
  
          const { totalUsers, activeUsers } = statsResponse.data.data;
          setStats({
            totalUsers,
            activeUsers,
            salesGrowth: [0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 2000],
          });
  
          // Fetch total sales for admin
          const totalSalesResponse = await axios.get("/api/orders/allTotalSales", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
  
          setTotalSales(totalSalesResponse.data.totalSales);
        } else if (role === "seller") {
          // Fetch total products for seller
          const totalProductsResponse = await axios.get(
            "/api/products/myTotalProducts",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
  
          // Fetch rated product stats
          const ratedProductStatsResponse = await axios.get(
            "/api/products/getRatedProductStats",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const products = ratedProductStatsResponse.data.products || [];
          let totalHighRated = 0;
          let totalLowRated = 0;
          let totalRatingSum = 0;

          // Calculate counts and average rating
          products.forEach((product) => {
            if (product.averageRating >= 3) {
              totalHighRated++;
            } else if (product.averageRating > 0) {
              totalLowRated++;
            }
            if (product.averageRating) {
              totalRatingSum += product.averageRating;
            }
          });

          const averageRating =
            products.length > 0 ? (totalRatingSum / products.length).toFixed(2) : 0;

          console.log("This is response", ratedProductStatsResponse.data);
          
          setStats((prevStats) => ({
            ...prevStats,
            totalProducts: totalProductsResponse.data.data.totalProducts,
            highRatedProducts: totalHighRated,
            lowRatedProducts: totalLowRated,
            averageRating, // Add average rating to stats
            salesGrowth: [0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 2000],
          }));
        }
      } catch (error) {
        console.error("Error fetching role or stats:", error);
      }
    };
  
    fetchUserRoleAndStats();
  }, []);
  

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug","Sep","Oct","Nov","Dec",],
    datasets: [
      {
        label: "Sales Growth",
        data: stats.salesGrowth || [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="flex flex-col p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-900">
          {userRole === "admin" ? "Admin Dashboard" : "Seller Dashboard"}
        </h1>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
          New Notification
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userRole === "admin" ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold text-gray-700">
                Total Users
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.totalUsers}
              </p>
              <FaUsers className="text-gray-500 text-3xl mt-4" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold text-gray-700">
                Active Users
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.activeUsers}
              </p>
              <FaUsers className="text-green-500 text-3xl mt-4" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold text-gray-700">
                Total Sales
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalSales !== null
                  ? `Rs ${totalSales.toLocaleString()}`
                  : "Loading..."}
              </p>
              <FaChartLine className="text-blue-500 text-3xl mt-4" />
            </div>
          </>
        ) : (
          <>
            {userRole === "seller" && (
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                <h3 className="text-xl font-semibold text-gray-700">
                  Total Products
                </h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalProducts !== undefined
                    ? stats.totalProducts
                    : "Loading..."}
                </p>
                <AiFillProduct className="text-gray-500 text-4xl mt-4" />
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold text-gray-700">
                High Rated Products
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.highRatedProducts}
              </p>
              <PiListStarFill className="text-green-500 text-4xl mt-4" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold text-gray-700">
                Low Rated Products
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.lowRatedProducts}
              </p>
              <PiListStarFill className="text-red-500 text-4xl mt-4" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-xl font-semibold text-gray-700">
                Your's Shop Ratings
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.averageRating || "N/A"}
              </p>
              <FcShop className="text-blue-500 text-4xl mt-4" />
            </div>
          </>
        )}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Sales Growth Over Time
        </h3>
        <div className="w-7/10" style={{ height: "400px" }}>
          <Line
            data={chartData}
            options={chartOptions}
            width={window.innerWidth * 0.7}
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
