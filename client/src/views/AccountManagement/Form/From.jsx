import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { apiGetPosition } from "../../../service/api/position";
import { apiGetPermission } from "../../../service/api/listPermissions";

const FromCustom = ({ open, onClose, handleSubmit, isEdit, dataRow }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    positions: "",
    permissions: "",
  });

  const [position, setListPosition] = useState([]);
  const [permission, setListPermission] = useState([]);

  // call api

  const handleGetLisPosition = async () => {
    try {
      const result = await apiGetPosition({
        keySearch: "",
        page: 1,
        size: 100,
      });
      if (result.data.status === 200) {
        setListPosition(result.data.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.warning("Hệ thống đang bảo trì!");
    }
  };

  const handleGetPermission = async () => {
    try {
      const result = await apiGetPermission({
        keySearch: "",
        page: 1,
        size: 100,
      });
      if (result.data.status === 200) {
        setListPermission(result.data.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.warning("Hệ thống đang bảo trì!");
    }
  };

  // call api

  const handleClose = () => {
    onClose();
    setFormData({
      id: null,
      name: "",
      email: "",
      password: "",
      positions: "",
      permissions: "",
    });
  };

  const handleSetFromData = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async () => {
    const res = await handleSubmit(formData);
    if (res.success) {
      handleClose();
    }
  };

  useEffect(() => {
    if (dataRow) {
      setFormData({ ...formData, ...dataRow });
    }
  }, [dataRow]);

  useEffect(() => {
    handleGetLisPosition();
    handleGetPermission();
  }, []);

  return (
    <Modal size="lg" show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit === "Forgotpassword"
            ? "Quên mật khẩu"
            : isEdit
            ? "Chỉnh sửa tài khoản"
            : "Tạo tài khoản"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isEdit === "Forgotpassword" ? (
          <form>
            <div className="form-group">
              <label htmlFor="email">Nhập Email</label>
              <input
                type="text"
                className="form-control"
                id="email"
                placeholder="Nhập tên Tài khoản"
                name="email"
                value={formData.email}
                onChange={(e) => handleSetFromData(e)}
              />
            </div>
          </form>
        ) : (
          <form>
            <div className="form-group">
              <label htmlFor="name">Nhập họ và tên </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Nhập họ và tên"
                name="name"
                value={formData.name}
                onChange={(e) => handleSetFromData(e)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Nhập Email</label>
              <input
                type="text"
                className="form-control"
                id="email"
                placeholder="Nhập tên Tài khoản"
                name="email"
                value={formData.email}
                onChange={(e) => handleSetFromData(e)}
              />
            </div>
            {isEdit ? (
              ""
            ) : (
              <div className="form-group">
                <label htmlFor="password">Nhập mật khẩu :</label>
                <input
                  type="text"
                  className="form-control"
                  id="password"
                  placeholder="Nhập mật khẩu"
                  name="password"
                  value={formData.password}
                  onChange={(e) => handleSetFromData(e)}
                />
              </div>
            )}{" "}
            <div className="form-group">
              <label htmlFor="positions">Chọn chức vụ : </label>
              <select
                className="form-select"
                value={formData.positions}
                name="positions"
                onChange={(e) => handleSetFromData(e)}
              >
                {position.map((department, index) => (
                  <option key={index} value={department._id}>
                    {department.name}
                    <span> - Phòng ban: {department.room.name}</span>
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="permissions">Chọn Quyền : </label>
              <select
                className="form-select"
                value={formData.permissions}
                name="permissions"
                onChange={(e) => handleSetFromData(e)}
              >
                {permission.map((department, index) => (
                  <option key={index} value={department._id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
          </form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FromCustom;
