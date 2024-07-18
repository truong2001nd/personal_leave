import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

const FromCustom = ({ open, onClose, handleSubmit, isEdit, dataRow }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    user: [],
    permission: [],
    position: [],
    room: [],
    single: [],
    singleType: [],
    status: "",
  });

  const options = ["create", "read", "update", "delete"];
  const handleClose = () => {
    onClose();
    setFormData({
      id: null,
      name: "",
      user: [],
      permission: [],
      position: [],
      room: [],
      single: [],
      singleType: [],
      status: "",
    });
  };

  const handleOptionChange = (e) => {
    const { name, value, checked } = e.target;

    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData };

      if (typeof updatedFormData[name] === "string") {
        updatedFormData[name] = value;
      }
      // Xử lý với các trường có kiểu dữ liệu mảng
      else if (Array.isArray(updatedFormData[name])) {
        if (checked) {
          updatedFormData[name] = [...updatedFormData[name], value];
        } else {
          updatedFormData[name] = updatedFormData[name].filter(
            (item) => item !== value
          );
        }
      }

      return updatedFormData;
    });
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

  return (
    <Modal size="lg" show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Chỉnh sửa quyền" : "Tạo quyền"} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <table className="table table-bordered table-striped table-responsive-sm">
            <tr>
              <th className="text-center">Tên quyền</th>
              <th className="text-center">
                <div className="form-group " style={{ width: "100%" }}>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Nhập tên quyền"
                    name="name"
                    value={formData.name}
                    onChange={handleOptionChange}
                  />
                </div>
              </th>
            </tr>
            <tr>
              <th className="text-center">Tài khoản</th>
              <th className="text-center">
                {options.map((options, index) => (
                  <div key={index} className="form-check form-check-inline ">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`checkbox-${options}`}
                      name="user"
                      value={options}
                      checked={formData.user.includes(options)}
                      onChange={handleOptionChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`inlineRadio-${options}`}
                    >
                      {options}
                    </label>
                  </div>
                ))}
              </th>
            </tr>
            <tr>
              <th className="text-center">Quyền</th>
              <th className="text-center">
                {options.map((options, index) => (
                  <div key={index} className="form-check form-check-inline ">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`checkbox-${options}`}
                      name="permission"
                      value={options}
                      checked={formData.permission.includes(options)}
                      onChange={handleOptionChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`inlineRadio-${options}`}
                    >
                      {options}
                    </label>
                  </div>
                ))}
              </th>
            </tr>
            <tr>
              <th className="text-center">Chức vụ</th>
              <th className="text-center">
                {options.map((options, index) => (
                  <div key={index} className="form-check form-check-inline ">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`checkbox-${options}`}
                      name="position"
                      value={options}
                      checked={formData.position.includes(options)}
                      onChange={handleOptionChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`inlineRadio-${options}`}
                    >
                      {options}
                    </label>
                  </div>
                ))}
              </th>
            </tr>
            <tr>
              <th className="text-center">phòng ban</th>
              <th className="text-center">
                {options.map((options, index) => (
                  <div key={index} className="form-check form-check-inline ">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`checkbox-${options}`}
                      name="room"
                      value={options}
                      checked={formData.room.includes(options)}
                      onChange={handleOptionChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`inlineRadio-${options}`}
                    >
                      {options}
                    </label>
                  </div>
                ))}
              </th>
            </tr>
            <tr>
              <th className="text-center">Đơn</th>
              <th className="text-center">
                {options.map((options, index) => (
                  <div key={index} className="form-check form-check-inline ">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`checkbox-${options}`}
                      name="single"
                      value={options}
                      checked={formData.single.includes(options)}
                      onChange={handleOptionChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`inlineRadio-${options}`}
                    >
                      {options}
                    </label>
                  </div>
                ))}
              </th>
            </tr>
            <tr>
              <th className="text-center">Phê duyệt</th>
              <th className="text-center">
                {options.map((options, index) => (
                  <div key={index} className="form-check form-check-inline ">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`checkbox-${options}`}
                      name="singleType"
                      value={options}
                      checked={formData.singleType.includes(options)}
                      onChange={handleOptionChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`inlineRadio-${options}`}
                    >
                      {options}
                    </label>
                  </div>
                ))}
              </th>
            </tr>
            <tr>
              <th className="text-center">status:</th>
              <th className="text-center">
                <div className="form-group ">
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleOptionChange}
                  >
                    <option value="">chọn status</option>
                    <option value={0}>0</option>
                    <option value={1}>1</option>
                  </select>
                </div>
              </th>
            </tr>
          </table>
        </div>
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
