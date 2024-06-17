import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const FromCustom = ({ open, onClose, handleSubmit, isEdit, dataRow, data }) => {
  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (e, action) => {
    e.preventDefault();
    dataRow.status = action === "approve" ? 1 : 2;
    const res = await handleSubmit(dataRow);

    if (res.success) {
      handleClose();
    }
  };
  return (
    <Modal size="lg" show={open} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEdit ? "Chỉnh sửa Chức vụ" : "Tạo chức vụ"}{" "}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Tên đơn(*)</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={dataRow.name}
                  required
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>
          {dataRow.content &&
            JSON.parse(dataRow.content).map((data, i) => {
              if (data.key === "approver") {
                return (
                  <Row className="mt-2" key={data.key}>
                    <Col>
                      <Form.Group controlId="formName">
                        <Form.Label>
                          {data.label}
                          {data.required ? "(*)" : ""}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name={data.key}
                          required={data.required}
                          value={dataRow.approver.name}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                );
              }
              return (
                <Row className="mt-2" key={data.key}>
                  <Col>
                    <Form.Group controlId="formName">
                      <Form.Label>
                        {data.label}
                        {data.required ? "(*)" : ""}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name={data.key}
                        required={data.required}
                        value={data.value}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>
              );
            })}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={(e) => onSubmit(e, "approve")}>
          chấp thuận
        </Button>
        <Button variant="danger" onClick={(e) => onSubmit(e, "reject")}>
          Từ chối
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Thoát
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FromCustom;
