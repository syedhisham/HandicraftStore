import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import { FaCog } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";
import { IoHelpCircleSharp } from "react-icons/io5";
import { FaPowerOff } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { RiShieldCheckFill } from "react-icons/ri";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorToast from "./ErrorToast";
import SuccessToast from "./SuccessToast";

const profileMenuItemsBase = [
  { label: "My Profile", icon: FaUserCircle },
  { label: "Edit Profile", icon: FaCog },
  { label: "Inbox", icon: AiOutlineDownload },
  { label: "Help", icon: IoHelpCircleSharp },
];

const AvatarWithUserDropdown = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userImage, setUserImage] = useState(""); // State to store user image
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/api/users/userDetails");
        const userData = response.data.data;

        // Check if the user is admin
        if (userData.role === "admin" || userData.role === "seller" ) {
          setIsAdmin(true);
        }

        // Set user image
        setUserImage(userData.image);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      SuccessToast("Logged out successfully!");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Error logging out:", error);
      ErrorToast("Error logging out. Please try again.");
    }
  };

  const handleMenuItemClick = (label) => {
    if (label === "Sign Out") {
      handleLogout();
    } else if (label === "Admin Panel") {
      navigate("/adminPanel");
    }
    closeMenu();
  };

  const closeMenu = () => setIsMenuOpen(false);
  const profileMenuItems = [
    ...profileMenuItemsBase,
    ...(isAdmin
      ? [
          {
            label: "Admin Panel",
            icon: RiShieldCheckFill,
          },
        ]
      : []),
    {
      label: "Sign Out",
      icon: FaPowerOff,
    },
  ];

  const filteredMenuItems = isAdmin
    ? profileMenuItems.filter((item) => item.label !== "Help")
    : profileMenuItems;

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center rounded-full p-0"
        >
          <Avatar
            variant="circular"
            withBorder={true}
            color="blue-gray"
            className="p-0.5 rounded-full object-cover 
             w-6 h-6 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-10 xl:h-10"
            src={userImage || "https://via.placeholder.com/150"} // Fallback placeholder
            alt="User Avatar"
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {filteredMenuItems.map(({ label, icon }) => (
          <MenuItem
            key={label}
            onClick={() => handleMenuItemClick(label)}
            className={`flex items-center gap-2 rounded ${
              label === "Sign Out"
                ? "text-orange-500 hover:bg-orange-500/30 focus:bg-orange-500/10 active:bg-orange-500/10"
                : ""
            }`}
          >
            {React.createElement(icon, {
              className: `h-4 w-4 ${
                label === "Sign Out" ? "text-orange-500" : ""
              }`,
              strokeWidth: 2,
            })}
            <Typography
              as="span"
              variant="small"
              className="font-normal"
              color={label === "Sign Out" ? "orange" : "inherit"}
            >
              {label}
            </Typography>
          </MenuItem>
        ))}
      </MenuList>
      <ToastContainer />
    </Menu>
  );
};

export default AvatarWithUserDropdown;
