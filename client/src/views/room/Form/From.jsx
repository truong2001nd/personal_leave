import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

const FromCustom = ({ open, onClose, handleSubmit, isEdit, dataRow }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
  });

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

  return (
    <Modal size="lg" show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit ? "Chỉnh sửa phòng ban" : "Tạo phòng ban"}{" "}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group">
            <label htmlFor="name">Tên phòng ban</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Nhập tên Phòng ban"
              name="name"
              value={formData.name}
              onChange={(e) => handleSetFromData(e)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Nội dung chi tiết phòng ban</label>
            <input
              type="text"
              className="form-control"
              id="description"
              placeholder="Nhập mật nội dung"
              name="description"
              value={formData.description}
              onChange={(e) => handleSetFromData(e)}
            />
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
