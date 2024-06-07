import React, { useState } from "react";

import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { apiUpdateAccount, apiUpdatePassword } from "../../service/api/account";

const Account = () => {
  const { authState, dispatch } = useContext(AuthContext);
  const { user } = authState;

  // configure data
  const [dataFrom, setDataFrom] = useState({
    name: user.name,
    email: user.email,
    sex: user.sex,
    phone: user.phone,
    birthday: user.birthday,
  });
  const [dataPassword, setDataPassword] = useState({
    password: "",
    newPassword: "",
  });

  // configure data

  // modal

  const [showProfile, setShowProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = (setShow) => setShow(false);
  const handleShow = (setShow) => setShow(true);

  // modal

  // event handlers

  function handleClickProfile() {
    handleShow(setShowProfile);
  }
  function handleClickPassword() {
    handleShow(setShowPassword);
  }
  const handleChangeFromData = (name, value, data) => {
    data((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await apiUpdateAccount(dataFrom);
      if (res.data.status === 200) {
        dispatch({
          type: "SET_USER",
          payload: { user: res.data.data },
        });

        handleClose(setShowProfile);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống bảo trì!");
    }
  };
  const handleSubmitPassword = async () => {
    try {
      const res = await apiUpdatePassword(dataPassword);

      if (res.data.status === 200) {
        dispatch({
          type: "SET_USER",
          payload: { user: res.data.data },
        });
        handleClose(setShowPassword);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống bảo trì!");
    }
  };

  const getSexText = (sex) => {
    if (sex === 0) {
      return "Nữ";
    } else if (sex === 1) {
      return "Nam";
    } else {
      return "Chưa xác định";
    }
  };

  // event handlers

  return (
    <Container fluid className="my-5">
      <Row className="d-flex justify-content-center">
        <Col md={2}>
          <Card>
            <Card.Img variant="top" src="https://via.placeholder.com/150" />
            <Card.Body>
              <Card.Title>{user.name}</Card.Title>
              <Card.Text> {user.positions.name}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={5}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center font-weight-bold">
                Thông tin tài khoản
              </Card.Title>
              <Row>
                <Col>
                  <p>Họ tên: {user.name}</p>
                  <p>Email: {user.email}</p>
                  <p>Phone: {user.phone}</p>
                </Col>
                <Col>
                  <p>Ngày sinh:{user.birthday} </p>
                  <p>Phòng ban: {user.room.name} </p>
                  <p>Giới tính: {getSexText(user.sex)}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="primary"
                    className="mr-2"
                    onClick={handleClickProfile}
                  >
                    Sửa thông tin cá nhân
                  </Button>
                  <Button
                    variant="primary"
                    className="mr-2"
                    onClick={handleClickPassword}
                  >
                    Thay đổi mật khẩu
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* modal sửa thông tin */}
      <Modal size="lg" show={showProfile} onHide={setShowProfile}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật thông tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="name">Họ tên:</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Nhập họ tên"
                name="name"
                value={dataFrom.name}
                onChange={(e) =>
                  handleChangeFromData("name", e.target.value, setDataFrom)
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                name="email"
                value={dataFrom.email}
                onChange={(e) =>
                  handleChangeFromData("email", e.target.value, setDataFrom)
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại:</label>
              <input
                type="number"
                className="form-control"
                id="phone"
                placeholder="Enter password"
                name="phone"
                value={dataFrom.phone}
                onChange={(e) =>
                  handleChangeFromData("phone", e.target.value, setDataFrom)
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="birthday">Ngày sinh:</label>
              <input
                type="text"
                className="form-control"
                id="birthday"
                placeholder="Enter password"
                name="birthday"
                value={dataFrom.birthday}
                onChange={(e) =>
                  handleChangeFromData("birthday", e.target.value, setDataFrom)
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="sex">Giới tính:</label>
              <select
                className="form-select"
                value={dataFrom.sex}
                onChange={(e) =>
                  handleChangeFromData("sex", e.target.value, setDataFrom)
                }
              >
                <option value="">Chọn giới tính</option>
                <option value="1">Nam</option>
                <option value="0">Nữ</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfile(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
      {/* modal thay đổi mật khẩu */}
      <Modal size="lg" show={showPassword} onHide={setShowPassword}>
        <Modal.Header closeButton>
          <Modal.Title>Đổi mật khẩu</Modal.Title>
        </Modal.Header>
        <form>
          <div className="form-group">
            <label htmlFor="name">Mật khẩu cũ:</label>
            <input
              type="text"
              className="form-control"
              id="password"
              placeholder="Nhập mật khẩu cũ"
              name="password"
              value={dataPassword.password}
              onChange={(e) =>
                handleChangeFromData(
                  "password",
                  e.target.value,
                  setDataPassword
                )
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Mật khẩu mới:</label>
            <input
              type="text"
              className="form-control"
              id="newPassword"
              placeholder="Nhập mật khẩu mới"
              name="newPassword"
              value={dataPassword.newPassword}
              onChange={(e) =>
                handleChangeFromData(
                  "newPassword",
                  e.target.value,
                  setDataPassword
                )
              }
            />
          </div>
        </form>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPassword(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmitPassword}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Account;
