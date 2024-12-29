import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import AllProducts from "./components/AllProducts";
import DetailedProduct from "./components/DetailedProduct";
import AdminPanel from "./pages/AdminPanel";
import Layout from "./components/Layout";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import CraftsMap from "./pages/CraftsMap";
import CeramicsPottery from "./pages/crafts/CeramicsPottery";
import Basketry from "./pages/crafts/Basketry";
import CamelSkin from "./pages/crafts/CamelSkin";
import WoodCraft from "./pages/crafts/WoodCraft";
import Ajrak from "./pages/crafts/Ajrak";
import Khussa from "./pages/crafts/Khussa";
import BoxesJars from "./pages/decor/BoxesJars";
import Lamps from "./pages/decor/Lamps";
import Paintings from "./pages/decor/Paintings";
import Furniture from "./pages/decor/Furniture";
import Cushions from "./pages/decor/Cushions";
import TissueBoxCovers from "./pages/decor/TissueBoxCovers";
import RugsCarpets from "./pages/decor/RugsCarpets";
import ScarfsShawls from "./pages/apparel/ScarfsShawls";
import UnstitchedFabric from "./pages/apparel/UnstitchedFabric";
import HatsCaps from "./pages/apparel/HatsCaps";
import SweatersCoatsUppers from "./pages/apparel/SweatersCoatsUppers";
import ClutchesWristlets from "./pages/accessories/ClutchesWristlets";
import Bangles from "./pages/accessories/Bangles";
import Necklaces from "./pages/accessories/Necklaces";
import GlovesMitts from "./pages/accessories/GlovesMitts";
import AllCategoryProducts from "./components/AllCategoryProducts";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

function App() {

  return (
    <Router>
      <Routes>
      <Route element={<Layout />} >
      <Route path="/detailedProduct/:productId" element={<DetailedProduct />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/craftMap" element={<CraftsMap />} />
      <Route path="/orderConfirmation/:orderId" element={<OrderConfirmation />} />
      <Route path="/ceramics-pottery" element={<CeramicsPottery />} />
      <Route path="/basketry" element={<Basketry />} />
      <Route path="/camel-skin" element={<CamelSkin />} />
      <Route path="/wood-craft" element={<WoodCraft />} />
      <Route path="/ajrak" element={<Ajrak />} />
      <Route path="/khussa" element={<Khussa />} />
      <Route path="/boxes-jars" element={<BoxesJars />} />
      <Route path="/lamps" element={<Lamps />} />
      <Route path="/paintings" element={<Paintings />} />
      <Route path="/furniture" element={<Furniture />} />
      <Route path="/cushions" element={<Cushions />} />
      <Route path="/tissue-box-covers" element={<TissueBoxCovers />} />
      <Route path="/rugs-carpets" element={<RugsCarpets />} />
      <Route path="/scarfs-shawls" element={<ScarfsShawls />} />
      <Route path="/unstitched-fabric" element={<UnstitchedFabric />} />
      <Route path="/hats-caps" element={<HatsCaps />} />
      <Route path="/sweaters-coats-uppers" element={<SweatersCoatsUppers />} />
      <Route path="/clutches-wristlets" element={<ClutchesWristlets />} />
      <Route path="/bangles" element={<Bangles />} />
      <Route path="/necklaces" element={<Necklaces />} />
      <Route path="/gloves-mitts" element={<GlovesMitts />} />
      <Route path="/allCategoryProducts" element={<AllCategoryProducts />} />
      <Route path="/aboutUs" element={<AboutUs />} />
      <Route path="/contactUs" element={<ContactUs />} />



      </Route>
      
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/addProduct" element={<AddProduct />} />
      <Route path="/allProducts" element={<AllProducts />} />
      <Route path="/adminPanel" element={<AdminPanel />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      </Routes>
    </Router>
  )
}

export default App
