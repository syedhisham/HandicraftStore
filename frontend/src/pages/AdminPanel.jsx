import React, { useState, useEffect } from "react";
import { FaHome, FaUsers, FaShoppingBag, FaArrowLeft, FaPlus, FaList } from "react-icons/fa";
import { RiUserStarFill } from "react-icons/ri";
import { TiUserDelete } from "react-icons/ti";
import { VscMultipleWindows } from "react-icons/vsc";
import { MdArchive, MdPreview, MdCancel } from "react-icons/md";
import { GrDocumentUpdate } from "react-icons/gr";
import AddProduct from "./AddProduct";
import axios from "axios";
import UserList from "../components/UserList";
import MostActiveUsers from "../components/MostActiveUsers";
import UserDeleteList from "../components/UserDeleteList";
import Dashboard from "../components/AdminDashboard";
import MyProducts from "../components/MyProducts";
import ManageProducts from "../components/ManageProducts";
import SellerOrders from "../components/SellerOrders";
import ManageOrderStatus from "../components/ManageOrderStatus";
import AdminHeader from "../components/AdminHeader";
import LowRatedProducts from "../components/LowRatedProducts";
import HighRatedProducts from "../components/HighRatedProducts";

const sidebarItems = [
  { label: "Dashboard", icon: FaHome, component: <Dashboard /> },
];

const productManagementItems = [
  { label: "Add Product", icon: FaPlus, component: <AddProduct /> },
  { label: "Manage Products", icon: FaList, component: <ManageProducts /> },
  { label: "All Products", icon: VscMultipleWindows, component: <MyProducts /> },
  { label: "Low Rated Products", icon: FaShoppingBag, component: <LowRatedProducts/> },  
  { label: "High Rated Products", icon: FaShoppingBag, component: <HighRatedProducts/> },
];

const userManagementItems = [
  { label: "All Users", icon: FaUsers, component: <UserList /> },
  { label: "Most Active Users", icon: RiUserStarFill, component: <MostActiveUsers /> },
  { label: "Delete Users", icon: TiUserDelete, component: <UserDeleteList /> },
];

const orderManagementItems = [
  { label: "View Orders", icon: MdPreview, component: <SellerOrders/> },
  { label: "Update Order Status", icon: GrDocumentUpdate, component: <ManageOrderStatus/> },
];

const AdminPanel = () => {
  const [activeComponent, setActiveComponent] = useState(sidebarItems[0].component);
  const [compactSidebar, setCompactSidebar] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({
    Product: false,
    User: false,
    Order: false,
  });
  const [userRole, setUserRole] = useState(null); // State to hold the user role
  const [loading, setLoading] = useState(true); // Loading state for fetching user role

  // Fetch the user role from the API
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get("/api/users/getUserRole"); // Fetch role from the backend
        setUserRole(response.data.data);
         // Set the fetched role
      } catch (error) {
        console.error("Error fetching user role", error);
      } finally {
        setLoading(false); // Set loading to false once the role is fetched
      }
    };

    fetchUserRole(); // Fetch the role when the component mounts
  }, []);

  const handleDropdownToggle = (key) => {
    setDropdownStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSidebarItems = (label, items, key, IconComponent) => (
    <>
      <button
        className={`flex items-center w-full px-4 py-2 text-left text-white rounded-md transition-all duration-200 text-lg hover:bg-orange-700 ${dropdownStates[key] ? "bg-orange-700" : ""}`}
        onClick={() => handleDropdownToggle(key)}
      >
        <span className="mr-3 text-3xl">
          <IconComponent /> {/* Render the icon component */}
        </span>
        {!compactSidebar && label}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${dropdownStates[key] ? "max-h-screen" : "max-h-0"}`}
      >
        <ul className="ml-4 space-y-1">
          {items.map((item, idx) => (
            <li key={idx}>
              <button
                className="flex items-center gap-x-2 w-full px-4 py-2 text-left text-white bg-orange-800 rounded-md transition-all duration-200 hover:bg-orange-600"
                onClick={() => setActiveComponent(item.component)}
              >
                <span className="text-xl">
                  <item.icon /> {/* Render the icon component for each submenu item */}
                </span>
                {!compactSidebar && item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );

  if (loading) {
    return <div>Loading...</div>; // Display loading state while fetching the role
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <AdminHeader />

      <div className="flex flex-1">
        <aside className={`bg-orange-900 text-white transition-all duration-300 ${compactSidebar ? "w-24" : "w-80"}`}>
          <div className="flex items-center justify-between px-4 py-4 border-b border-orange-700">
            {!compactSidebar && <h1 className="text-3xl font-bold">Admin Panel</h1>}
            <button onClick={() => setCompactSidebar(!compactSidebar)}>
              <FaArrowLeft className={`w-6 h-6 transform transition-transform ${compactSidebar ? "rotate-180" : ""}`} />
            </button>
          </div>
          <nav className="p-4 space-y-2">
            <button
              className="flex items-center px-4 py-2 text-left text-white rounded-md transition-all duration-200 text-xl hover:bg-orange-700"
              onClick={() => setActiveComponent(sidebarItems[0].component)}
            >
              <span className="mr-3 text-3xl">
                <FaHome />
              </span>
              {!compactSidebar && "Dashboard"}
            </button>

            {/* Render role-specific sidebar items */}
            {userRole === "admin" && (
              <>
                {renderSidebarItems("User Management", userManagementItems, "User", FaUsers)}
                
              </>
            )}

            {userRole === "seller" && (
              <>
                {renderSidebarItems("Product Management", productManagementItems, "Product", FaShoppingBag)}
                {renderSidebarItems("Order Management", orderManagementItems, "Order", MdArchive)}
              </>
            )}
          </nav>
        </aside>

        <main className="flex-1 bg-gray-100 p-6">
          {activeComponent}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
