import React from "react";
import Header from "./Header";
import MobileHeader from "./MobileHeader";

const Layout = ({ children }) => {
  return (
    <div className="main-bg max-w-[100vw] w-[100vw] relative h-[100vh] overflow-scroll no-scrollbar">
      <Header />
      {children}
      <MobileHeader />
    </div>
  );
};

export default Layout;
