import React from "react";
import "../../assets/style/header.css";
import { Nav, Navbar, Container } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar
      className="justify-content-md-center"
      style={{ backgroundColor: "#f3969a" }}
    >
      <Container style={{ margin: 0 }}>
        <Nav className="w-100 d-flex align-items-center fw-bold">
          <Nav.Item className="mr-auto ">
            <Navbar.Brand href="#home">Logo</Navbar.Brand>
          </Nav.Item>
          <Nav.Item className="mr-auto">
            <Nav.Link href="/Account">Account</Nav.Link>
          </Nav.Item>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto ">
              <Nav.Link href="/Home">Trang chủ</Nav.Link>
              <Nav.Link href="#home">Đơn đã gửi</Nav.Link>
              <Nav.Link href="#features">Đơn gửi đến</Nav.Link>
              <Nav.Link href="#pricing">Phòng ban</Nav.Link>
              <Nav.Link href="#about">Thống kê</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
