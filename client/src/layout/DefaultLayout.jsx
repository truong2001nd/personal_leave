import React from "react";
import Header from "../components/layout/Header";

const DefaultLayout = ({ children, showHeader = true }) => {
  return (
    <div>
      {showHeader && (
        <div className="header-container ">
          <Header />
        </div>
      )}
      <div className="content">
        <div className="main-content">
          <div className="content-wrapper">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
