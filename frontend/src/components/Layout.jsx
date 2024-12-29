import React from 'react';
import  { NavbarWithMegaMenu } from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { NavbarWithSearch } from './NavbarWithSearch';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarWithSearch/>
      <NavbarWithMegaMenu/>
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
