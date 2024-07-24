import React, { useContext } from "react";
import "../../assets/style/header.css";
import { FaRegUserCircle } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { PiDroneFill } from "react-icons/pi";
import { SiJetpackcompose } from "react-icons/si";
import { GrAddCircle } from "react-icons/gr";
import { FaHome } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { MdEventAvailable } from "react-icons/md";
import { GoPasskeyFill } from "react-icons/go";
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
            <FaHome /> <span>Trang chủ</span>
          </NavLink>
          {user?.permissions?.single?.some((role) => role === "create") && (
            <NavLink to={config.urls.createSingle} className="menu-item">
              <GrAddCircle />
              <span>Tạo đơn</span>
            </NavLink>
          )}
          {user?.permissions?.single?.some((role) => role === "create") && (
            <NavLink to={config.urls.statistical} className="menu-item">
              <MdEventAvailable />
              <span>Thống kê</span>
            </NavLink>
          )}

          {user?.permissions?.room?.some((role) => role === "create") &&
            user?.positions?.status === 1 && (
              <NavLink to={config.urls.room} className="menu-item">
                <SiGoogleclassroom /> <span>Phòng ban</span>
              </NavLink>
            )}
          {user?.permissions?.position?.some((role) => role === "create") &&
            user?.positions?.status === 1 && (
              <NavLink to={config.urls.position} className="menu-item">
                <SiJetpackcompose />
                <span>chức vụ </span>
              </NavLink>
            )}
          {user?.permissions?.permission?.some((role) => role === "create") &&
            user?.positions?.status === 1 && (
              <NavLink to={config.urls.permission} className="menu-item">
                <PiDroneFill />
                <span>Quyền</span>
              </NavLink>
            )}

          {user?.permissions?.user?.some((role) => role === "create") &&
            user?.positions?.status === 1 && (
              <NavLink to={config.urls.accountManagement} className="menu-item">
                <GoPasskeyFill />
                <span>Quản lý tài khoản</span>
              </NavLink>
            )}
        </div>
      </div>
      <div className="header-right">
        <NavLink to={config.urls.account} className="header-user">
          <FaRegUserCircle />
          <span>{user.name}</span>
        </NavLink>
        <div
          className="header-action"
          onClick={() => {
            logout();
            navigate(config.urls.login);
          }}
        >
          <span>Đăng xuất</span>
          <IoMdLogOut />
        </div>
      </div>
    </div>
  );
};

export default Header;
