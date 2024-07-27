import React from "react";

const SinglePrintContainer = () => {
  return (
    <div className="print-single-container">
      <div className="header">
        <h2>công ty</h2>
        <h2>Tên đơn</h2>
        <span>ngày tháng</span>
      </div>
      <div className="body">
        <div className="item">
          <span className="name">name</span>
          <span className="value">value</span>
        </div>
        <div className="item">
          <span className="name">name</span>
          <span className="value">value</span>
        </div>
      </div>
      <div className="footer">
        <div className="nt">
          <span className="tt">Người tạo đơn</span>
          <span className="cr-user">Người tạo đơn</span>
        </div>
        <div className="nd">
          <span className="tt">Người tạo đơn</span>
          <span className="ap-user">Người tạo đơn</span>
        </div>
      </div>
    </div>
  );
};

export default SinglePrintContainer;
