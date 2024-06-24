import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { apiGetRoom } from "../../../service/api/room";

const FromCustom = ({ open, onClose, handleSubmit, isEdit, dataRow, data }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    room: "",
    status: null,
  });

  const [listRoom, setListRoom] = useState([]);

  // call api

  const handleGetListRoom = async () => {
    try {
      const result = await apiGetRoom({
        keySearch: "",
        page: 1,
        size: 100,
      });
      if (result.data.status === 200) {
        setListRoom(result.data.data);
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
      description: "",
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
    handleGetListRoom();
  }, []);

  return (
    <Modal size="lg" show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit ? "Chỉnh sửa Chức vụ" : "Tạo chức vụ"}{" "}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group">
            <label htmlFor="name">Tên chức vụ</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Nhập tên chức vụ"
              name="name"
              value={formData.name}
              onChange={(e) => handleSetFromData(e)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="room">Chọn phòng ban: </label>
            <select
              className="form-select"
              value={formData.room}
              name="room"
              onChange={(e) => handleSetFromData(e)}
            >
              {listRoom.map((department, index) => (
                <option key={index} value={department._id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="sex">Trạng thái chức vụ:</label>
            <select
              className="form-select"
              value={formData.status}
              name="status"
              onChange={(e) => handleSetFromData(e)}
            >
              <option value="">Chọn giới tính</option>
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </div>
        </form>
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
