import React from "react";

import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const Account = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;

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
                  <p>Giới tính:{user.sex} </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="primary" className="mr-2">
                    Edit Profile
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Account;
