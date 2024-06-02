import React from "react";

const DefaultLayout = ({ children, showHeader = true }) => {
  return (
    <div className="app-container">
      {showHeader && <div className="header-container">header</div>}
      <div className="content-container">{children}</div>
    </div>
  );
};

export default DefaultLayout;
