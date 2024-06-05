import React from "react";
import Header from "../components/layout/Header";


const DefaultLayout = ({ children, showHeader = true }) => {
  return (
    <div className="app-container " >
         {showHeader && <div className="header-container " ><Header/></div>}
         <div className="content-container">{children}</div>
        </div>
     
  );
};

export default DefaultLayout;
