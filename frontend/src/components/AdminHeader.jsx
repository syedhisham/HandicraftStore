import React, { useState, useEffect } from "react";
import { FaSun } from "react-icons/fa";
import { BsCloudMoonFill } from "react-icons/bs";
import axios from "axios";
import AvatarWithUserDropdown from "./AvatarWithUserDropdown";



const AdminHeader = () => {
    const [time, setTime] = useState("");
    const [greeting, setGreeting] = useState("");
    const [icon, setIcon] = useState(<FaSun />); // Default to morning icon
    const [iconColor, setIconColor] = useState("text-yellow-500"); // Default to yellow for morning/afternoon
    const [firstName, setFirstName] = useState(""); // State for user's first name
  
    useEffect(() => {
      const updateTime = () => {
        const options = { timeZone: "Asia/Karachi", hour: "2-digit", minute: "2-digit", second: "2-digit" };
        const currentTime = new Date().toLocaleTimeString("en-US", options);
        setTime(currentTime);
  
        const currentHour = new Date().getHours();
  
        // Determine greeting, icon, and icon color based on time
        if (currentHour >= 6 && currentHour < 12) {
          setGreeting("Good Morning");
          setIcon(<FaSun />);
          setIconColor("text-orange-100"); // Yellow for morning
        } else if (currentHour >= 12 && currentHour < 18) {
          setGreeting("Good Afternoon");
          setIcon(<FaSun />);
          setIconColor("text-yellow-800"); // Yellow for afternoon
        } else {
          setGreeting("Good Evening");
          setIcon(<BsCloudMoonFill />);
          setIconColor("text-blue-800"); // Blue for evening
        }
      };
  
      updateTime(); // Initial time set
      const interval = setInterval(updateTime, 1000); // Update every second
  
      return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);
  
    // Fetch the user's first name from the backend
    useEffect(() => {
      const fetchUserFirstName = async () => {
        try {
          const response = await axios.get("/api/users/getUserFirstName"); // Fetch the first name from the backend
          setFirstName(response.data.data); // Set the fetched first name
        } catch (error) {
          console.error("Error fetching user first name", error);
        }
      };
  
      fetchUserFirstName(); // Fetch first name when component mounts
    }, []);
  
    return (
      <div className="bg-orange-900 text-white py-2 flex justify-between px-2 items-center space-x-2 h-16">
        <span className="text-lg font-semibold flex items-center">
          <span className={`text-3xl ${iconColor}`}>{icon}</span> {/* Apply dynamic color here */}
          <span className="ml-2">{greeting}, Dear {firstName || "Admin"} - {time}</span>
        </span>
        <div className="">
            <AvatarWithUserDropdown/>
        </div>
      </div>
      
    );
  };

export default AdminHeader
