import React from "react";
import axios from "axios";
import UserList from "./UserList";
import SuccessToast from "./SuccessToast";
import ErrorToast from "./ErrorToast";

const UserDeleteList = () => {
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/users/removeUser/${userId}`);
      SuccessToast("User deleted successfully.");
    } catch (error) {
      ErrorToast("Failed to delete user. Please try again later.");
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="p-4">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 text-center">
        Delete Users
      </h1>
      <UserList showFullDetails={false} onDelete={handleDelete} />
    </div>
  );
};

export default UserDeleteList;
