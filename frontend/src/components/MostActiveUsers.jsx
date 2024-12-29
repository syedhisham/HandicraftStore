import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingOverlay from "./LoadingOverlay";  // Assuming you have this component
import { Button } from "@material-tailwind/react";

const MostActiveUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`/api/users/getAllUsers`);
      const { users: fetchedUsers } = data.data;

      // Sort users by activityScore in descending order
      const sortedUsers = fetchedUsers.sort((a, b) => b.activityScore - a.activityScore);

      // Get only the top 5 users
      const top5Users = sortedUsers.slice(0, 5);

      setUsers(top5Users);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 text-center">
        Most Active Users
      </h1>

      {loading ? (
        <LoadingOverlay />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-[70%] mx-auto mt-10">
          {users.map((user) => (
            <div
              key={user._id}
              className="w-full bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 duration-300"
            >
              <div className="relative">
                <img
                  src={user.image}
                  alt="User"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                  <img
                    src={user.image}
                    alt="User"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white"
                  />
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold">{`${user.firstName} ${user.lastName}`}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Activity Score: {user.activityScore || 0}
                </p>
                <Button
                  onClick={() => {/* Add delete logic here if required */}}
                  className="mt-4 bg-orange-500 text-white hover:bg-orange-600 rounded-full py-2 px-4"
                >
                  Reward
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default MostActiveUsers;
