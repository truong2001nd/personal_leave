import React, { useState, useEffect, useContext } from "react";
import { CardContent } from "@mui/material";
import { toast } from "react-toastify";
import { apiGetSingleType, apiPostSingleType } from "../../service/api/single";
import { Button, Col, Form, Row } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import { apiGetRoomUserApprove } from "../../service/api/room";
import config from "../../config";
import { useNavigate } from "react-router-dom";

function ListSingle(props) {
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dataSinglesStyes, setDataSinglesStyes] = useState([]);
  // configure data
  const [dataOptionType, setDataOptionType] = useState({
    options: [],
    value: null,
  });
  const [dataFrom, setDataFrom] = useState({
    name: "",
    content: [],
    status: 0,
    singlesStyes: {},
    sender: authState.user._id,
    approver: null,
  });

  const [dataRoomApprover, setDataRoomApprover] = useState({
    options: [],
    value: null,
  });
  const [request, setRequest] = useState({
    keySearch: "",
    page: 1,
    size: 1000,
    _id: null,
  });

  // configure data

  // call api

  // Danh sách loai don
  const handleGetListSinglesStyes = async () => {
    try {
      const result = await apiGetSingleType({
        keySearch: "",
        page: 1,
        size: 1000,
        _id: null,
      });
      if (result.data.status === 200) {
        setDataSinglesStyes(result.data.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.warning("Hệ thống đang bảo trì!");
    }
  };
  const handleGetList = async () => {
    try {
      const result = await apiGetSingleType(request);
      if (result.data.status === 200) {
        const newContent = JSON.parse(result.data.data[0].content).map(
          (content) => {
            if (content.key === "fullName") {
              return { ...content, value: authState.user.name };
            }

            if (content.key === "position") {
              return { ...content, value: authState.user.positions.name };
            }

            if (content.key === "room") {
              return { ...content, value: authState.user.positions.room.name };
            }
            if (content.key === "requestDate") {
              return {
                ...content,
                value: new Date().toISOString().slice(0, 10),
              };
            }

            return { ...content, value: "" };
          }
        );

        setDataOptionType({
          options: result.data.data,
          value: result.data.data[0],
        });
        setDataFrom((prev) => {
          return {
            ...prev,
            name: result.data.data[0].name,
            singlesStyes: result.data.data[0]._id,
            content: newContent,
          };
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.warning("Hệ thống đang bảo trì!");
    }
  };

  const handleGetUserApprove = async (id) => {
    try {
      const result = await apiGetRoomUserApprove(id);

      if (result.data.status === 200) {
        setDataRoomApprover({
          options: [{ _id: "", name: "Chọn người duyệt" }, ...result.data.data],
          value: null,
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.warning("Hệ thống đang bảo trì!");
    }
  };

  // call api

  //event handler

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDataFrom({ ...dataFrom, [name]: value });
  };

  const handleInputChangeContent = (e) => {
    const newContent = dataFrom.content.map((content) => {
      if (content.key === e.target.name) {
        if (e.target.name === "numberOfDays" && e.target.value < 0) {
          toast.error("Số ngày nghỉ lớn hơn 0");
        } else {
          return { ...content, value: e.target.value };
        }
      }

      return content;
    });
    if (e.target.name === "approver") {
      setDataFrom({
        ...dataFrom,
        content: newContent,
        approver: e.target.value,
      });
    } else {
      setDataFrom({ ...dataFrom, content: newContent });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiPostSingleType(dataFrom);
      if (response.data.status === 200) {
        toast.success(response.data.message);
        navigate(config.urls.home);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống bảo trì!");
      return { success: false };
    }
  };

  //event handler

  useEffect(() => {
    handleGetList();
  }, [request]);
  useEffect(() => {
    handleGetListSinglesStyes();
  }, []);
  useEffect(() => {
    handleGetUserApprove(authState.user.positions.room._id);
  }, [authState.user.positions.room._id]);
  return (
    <div className="wrapper-screen-list">
      <div className="top-content">
        <div className="row">
          <div className="col-md-2">
            <div className="text-left">
              <h3 className="heading-page text-uppercase">Tạo đơn</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="body-content row">
        <div className="col-md-3">
          <div className="filter-options">
            <label className="font-weight-bold">Chọn loại đơn</label>
            <select
              className="form-select"
              value={dataFrom.singlesStyes}
              name="singlesStyes"
              onChange={(e) => {
                setRequest((prev) => {
                  return {
                    ...prev,
                    _id: e.target.value,
                    page: 1,
                  };
                });
              }}
            >
              {dataSinglesStyes?.map((department, index) => (
                <option key={index} value={department._id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-9 custom-col-child-padding pl-0">
          <CardContent className="card-content mb-5" sx={{ boxShadow: 0 }}>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Tên đơn(*)</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={dataOptionType?.value?.name}
                      onChange={handleInputChange}
                      disabled
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              {dataFrom.content.map((data, i) => {
                if (data.key === "fullName") {
                  return (
                    <Row className="mt-2" key={`${data.key}-${i}`}>
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
                            onChange={(e) => handleInputChange(e)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  );
                } else if (data.key === "position") {
                  return (
                    <Row className="mt-2" key={`${data.key}-${i}`}>
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
                            value={authState.user.positions.name}
                            disabled
                            onChange={handleInputChangeContent}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  );
                } else if (data.key === "room") {
                  return (
                    <Row className="mt-2" key={`${data.key}-${i}`}>
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
                            disabled
                            value={data.value}
                            onChange={handleInputChangeContent}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  );
                } else if (data.key === "numberOfDays") {
                  return (
                    <Row className="mt-2" key={`${data.key}-${i}`}>
                      <Col>
                        <Form.Group controlId="formName">
                          <Form.Label>
                            {data.label}
                            {data.required ? "(*)" : ""}
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name={data.key}
                            required={data.required}
                            value={data.value}
                            onChange={handleInputChangeContent}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  );
                } else if (data.key === "countedFromDate") {
                  const toDate = dataFrom.content.find(
                    (d) => d.key === "toDate"
                  );
                  const maxToDate = toDate
                    ? toDate.value
                    : new Date().toISOString().slice(0, 10);
                  return (
                    <Row className="mt-2" key={`${data.key}-${i}`}>
                      <Col>
                        <Form.Group controlId="formName">
                          <Form.Label>
                            {data.label}
                            {data.required ? "(*)" : ""}
                          </Form.Label>
                          <Form.Control
                            type="datetime-local"
                            name={data.key}
                            required={data.required}
                            value={data.value}
                            onChange={handleInputChangeContent}
                            min={new Date().toISOString().slice(0, 16)}
                            max={maxToDate}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  );
                } else if (data.key === "toDate") {
                  const countedFromDateField = dataFrom.content.find(
                    (d) => d.key === "countedFromDate"
                  );
                  const minDate = countedFromDateField
                    ? countedFromDateField.value
                    : new Date().toISOString().slice(0, 10);
                  return (
                    <Row className="mt-2" key={`${data.key}-${i}`}>
                      <Col>
                        <Form.Group controlId="formName">
                          <Form.Label>
                            {data.label}
                            {data.required ? "(*)" : ""}
                          </Form.Label>
                          <Form.Control
                            type="datetime-local"
                            name={data.key}
                            required={data.required}
                            value={data.value}
                            onChange={handleInputChangeContent}
                            min={minDate}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  );
                } else if (data.key === "requestDate") {
                  return (
                    <Row className="mt-2" key={`${data.key}-${i}`}>
                      <Col>
                        <Form.Group controlId="formName">
                          <Form.Label>
                            {data.label}
                            {data.required ? "(*)" : ""}
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name={data.key}
                            required={data.required}
                            value={data.value}
                            onChange={handleInputChangeContent}
                            disabled
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  );
                } else if (data.key === "approver") {
                  return (
                    <Row className="mt-2" key={`${data.key}-${i}`}>
                      <Col>
                        <Form.Group controlId="formName">
                          <Form.Label>
                            {data.label}
                            {data.required ? "(*)" : ""}
                          </Form.Label>
                          <select
                            className="form-select"
                            name={data.key}
                            required={data.required}
                            value={data.value}
                            onChange={handleInputChangeContent}
                          >
                            {dataRoomApprover.options.map((userApprove) => (
                              <option
                                key={userApprove._id}
                                value={userApprove._id}
                              >
                                {userApprove.name}
                              </option>
                            ))}
                          </select>
                        </Form.Group>
                      </Col>
                    </Row>
                  );
                }

                return (
                  <Row className="mt-2">
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
                          onChange={handleInputChangeContent}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                );
              })}

              <Button className="mt-3" type="submit" variant="primary">
                Gửi đơn
              </Button>
            </Form>
          </CardContent>
        </div>
      </div>
    </div>
  );
}

export default ListSingle;
