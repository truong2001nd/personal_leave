import React, { useContext } from "react";
import "../../assets/style/header.css";
import { FaRegUserCircle } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { PiDroneFill } from "react-icons/pi";
import { SiJetpackcompose } from "react-icons/si";
import { GrAddCircle } from "react-icons/gr";
import { FaHome } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { AuthContext } from "../../contexts/AuthContext";
import { NavLink } from "react-router-dom";
import config from "../../config";
import { useNavigate } from "react-router-dom";

const Header = () => {
  let navigate = useNavigate();
  const { authState, logout } = useContext(AuthContext);

  const { user } = authState;

  return (
    <div className="header-container">
      <div className="header-left">
        <div className="list-menu">
          <NavLink to={config.urls.home} className="menu-item">
            <FaHome /> <spam>Trang chủ</spam>
          </NavLink>
          {user.permissions.room.some((role) => role === "read") && (
            <NavLink to={config.urls.room} className="menu-item">
              <SiGoogleclassroom /> <spam>Phòng ban</spam>
            </NavLink>
          )}
          {user.permissions.position.some((role) => role === "read") && (
            <NavLink to={config.urls.position} className="menu-item">
              <SiJetpackcompose />
              <spam>chức vụ </spam>
            </NavLink>
          )}
          {user.permissions.permission.some((role) => role === "read") && (
            <NavLink to={config.urls.permission} className="menu-item">
              <PiDroneFill />
              <spam>Quyền</spam>
            </NavLink>
          )}
          <NavLink to={config.urls.createSingle} className="menu-item">
            <GrAddCircle />
            <spam>Tạo đơn</spam>
          </NavLink>
        </div>
      </div>
      <div className="header-right">
        <NavLink to={config.urls.account} className="header-user">
          <FaRegUserCircle />
          <spam>{user.name}</spam>
        </NavLink>
        <div className="header-action">
          <IoMdLogOut
            onClick={() => {
              logout();
              navigate(config.urls.login);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
