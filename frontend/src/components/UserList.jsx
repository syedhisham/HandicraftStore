import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorToast from "./ErrorToast";
import LoadingOverlay from "./LoadingOverlay";
import { Button, Input, IconButton } from "@material-tailwind/react";
import { CiSearch } from "react-icons/ci";

const UserList = ({ onDelete, showFullDetails = true, userListText = false }) => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`/api/users/getAllUsers`, {
        params: { page, limit },
      });

      const { users: fetchedUsers, totalUsers } = data.data;
      setUsers(fetchedUsers);
      setTotalUsers(totalUsers);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
      ErrorToast("Failed to fetch users. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalUsers / limit)) {
      setPage(newPage);
    }
  };

  const filteredUsers = useMemo(() => {
    // Filter users by email and sort by activityScore in descending order
    return users
      .filter((user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.activityScore - a.activityScore); // Sort by activityScore (highest first)
  }, [users, searchQuery]);

  const handleSearchClick = () => setIsSearchOpen(!isSearchOpen);

  return (
    <div className="max-w-[80%] mx-auto p-4">
      {showFullDetails && (
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          User List
        </h1>
      )}

      {loading ? (
        <LoadingOverlay />
      ) : (
        <>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="my-4 flex items-center">
            <IconButton
              className="mt-4"
              variant="outlined"
              onClick={handleSearchClick}
            >
              <CiSearch
                className="cursor-pointer text-gray-600 transition-transform duration-300 hover:scale-110"
                style={{ color: "black", fontSize: "2.5em" }}
                size={24}
              />
            </IconButton>

            <div
              className={`transition-all duration-500 ease-in-out ml-2 pt-5 overflow-hidden ${
                isSearchOpen ? "w-full" : "w-0"
              }`}
            >
              <Input
                variant="standard"
                type="text"
                label="Type to search"
                placeholder="Search by product name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-4 pr-4 py-2 w-full shadow-sm transition duration-300 transform ${
                  isSearchOpen ? "scale-100" : "scale-0"
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="w-[90%] bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105 duration-300"
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
                  {showFullDetails && (
                    <>
                      <p className="text-sm text-gray-600 mt-2">Role: {user.role}</p>
                      <p className="text-sm text-gray-600">
                        Registered Date:{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </>
                  )}
                  {!showFullDetails && (
                    <p className="text-sm text-gray-600 mt-2">
                      Activity Score: {user.activityScore || 0}
                    </p>
                  )}

                  {onDelete && (
                    <Button
                      onClick={() => onDelete(user._id)}
                      className="mt-4 bg-red-500 text-white hover:bg-red-600 rounded-full py-2 px-4"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span>
              Page {page} of {Math.ceil(totalUsers / limit)}
            </span>
            <Button
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === Math.ceil(totalUsers / limit)}
            >
              Next
            </Button>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default UserList;
