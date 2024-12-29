import {
  Navbar,
  Typography,
  IconButton,
  Button,
  Input,
  Badge,
} from "@material-tailwind/react";
import { PiShoppingCartThin } from "react-icons/pi";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AvatarWithUserDropdown from "./AvatarWithUserDropdown";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineProduct } from "react-icons/ai";

export function NavbarWithSearch() {
  const navigate = useNavigate();
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchTotalItems = async () => {
      if (!userId) {
        return;
      }

      try {
        const response = await axios.get(`/api/cart/total-items/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setTotalItems(response.data.data.totalItems);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTotalItems();
  }, [userId]);

  const handleCart = () => {
    navigate("/cart");
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/allCategoryProducts?search=${searchQuery}`);
    }
  };

  const handleAllProductClick = () => {
    navigate("/allCategoryProducts");
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  return (
    <Navbar className="mx-auto max-w-screen-4xl rounded-none bg-white px-4 py-3">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row items-center justify-between text-gray-900 w-full">
        {/* Left side - Brand name */}
        <Typography
          as="a"
          href="#"
          variant="h4"
          className="mr-4 ml-2 cursor-pointer py-1.5"
        >
          Crafted<span className="text-orange-600">Treasures</span>
        </Typography>

        {/* Centered search bar */}
        <div className="w-full sm:w-[60%] flex justify-center items-center sm:order-2 gap-x-4">
          <Button
            color="orange"
            variant="outlined"
            className="border-none flex gap-x-1 bg-orange-50/70 justify-center items-end cursor-pointer"
            onClick={handleAllProductClick}
          >
            <AiOutlineProduct className="text-2xl" />
            <span className="">All Products</span>
          </Button>
          <div className="relative flex w-full max-w-xl gap-2">
            <Input
              type="search"
              color="orange"
              label="Search products..."
              className="pr-20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              containerProps={{
                className: "min-w-[288px]",
              }}
            />
            <Button
              size="sm"
              color="orange"
              className="!absolute right-1 top-1 rounded"
              onClick={handleSearchSubmit}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Right side - Cart and User icons */}
        <div className="flex gap-4 sm:order-3">
          <Badge content={totalItems} withBorder>
            <IconButton className="bg- text-black" onClick={handleCart}>
              <PiShoppingCartThin className="h-8 w-8" />
            </IconButton>
          </Badge>
          <div className="w-full flex items-center justify-center rounded-full">
            {userId ? (
              <AvatarWithUserDropdown className="" />
            ) : (
              <div className="flex gap-4">
                <Button
                  color="orange"
                  variant="outlined"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
                <Button
                  color="orange"
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Navbar>
  );
}
