import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { apiGetSingle, apiGetSingleType } from "../../service/api/single";
import {
  CardContent,
  Pagination,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Col, Form, Row, Table } from "react-bootstrap";
import Update from "../Home/Form/Update";
import { dateFormatter } from "../../utils/dateFormatter";

const Home = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;
  const [dataFrom, setDataFrom] = useState([]);
  const [dataSingle, setSingle] = useState({});
  const [request, setRequest] = useState({
    keySearch: "",
    page: 1,
    size: 10,
    singlesStyes: "",
    date: "",
  });
  const [expandedRow, setExpandedRow] = useState(null);
  const handleToggleRow = (rowId) => {
    if (expandedRow === rowId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(rowId);
    }
  };

  // phân trang
  const [initIdPage, setInitIdPage] = useState(0);
  const [lastIdPage, setLastIdPage] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);

  const onPageClick = (data, value) => {
    setRequest({ ...request, page: value });
    window.scrollTo(0, 0);
  };

  const updateTotalPage = (totalRow, lastIdPage) => {
    Boolean(totalRow === 0)
      ? setInitIdPage(0)
      : setInitIdPage((request.page - 1) * request.size + 1);
    Boolean(lastIdPage < totalRow)
      ? setLastIdPage(request.size * request.page)
      : Boolean(totalRow === 0)
      ? setLastIdPage(0)
      : Boolean(request.page === Math.ceil(totalRow / request.size))
      ? setLastIdPage(totalRow)
      : setLastIdPage(request.size * request.page);
  };

  useEffect(() => {
    updateTotalPage(totalRecord, lastIdPage);
  }, [request, totalRecord, lastIdPage]);
  // phân trang
  // Danh sách loai don
  const handleGetList = async () => {
    try {
      const result = await apiGetSingleType({
        keySearch: "",
        page: 1,
        size: 100,
      });
      if (result.data.status === 200) {
        setDataFrom(result.data.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.warning("Hệ thống đang bảo trì!");
    }
  };
  // danh sách đơn đã gửi
  const handleGetlistSingle = async (url) => {
    try {
      const result = await apiGetSingle(url);
      setSingle(result.data.data);
      setTotalRecord(result.data.totalCount);
    } catch (error) {
      console.log(error);
      toast.warning("Hệ thống đang bảo trì!");
    }
  };
  useEffect(() => {
    handleGetList();
  }, [request]);
  useEffect(() => {
    handleGetlistSingle(request);
  }, [request]);
  //
  return (
    <div className="body-content row">
      <div className="top-content">
        <div className="row">
          <div className="col-md-3">
            <div className="text-left">
              <h3 className="heading-page text-uppercase">
                {" "}
                {user.positions.status === 0 ? "Đơn đã gửi" : "Đơn gửi đến"}
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="filter-options">
          <label className="font-weight-bold">Tìm kiếm theo :</label>
          <select
            className="form-select"
            value={request.singlesStyes}
            name="singlesStyes"
            onChange={(e) =>
              setRequest((prev) => {
                return {
                  ...prev,
                  singlesStyes: e.target.value,
                  page: 1,
                };
              })
            }
          >
            <option value="">Chọn loại đơn</option>
            {dataFrom.map((department, index) => (
              <option key={index} value={department._id}>
                {department.name}
              </option>
            ))}
          </select>
          <div className="form-group">
            <Row className="mt-2">
              <Col>
                <Form.Group controlId="formName">
                  <Form.Label></Form.Label>
                  <Form.Control
                    type="date"
                    value={request.date}
                    name="date"
                    onChange={(e) =>
                      setRequest((prev) => {
                        return {
                          ...prev,
                          date: e.target.value,
                          page: 1,
                        };
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <div className="col-md-9 custom-col-child-padding pl-0">
        <CardContent className="card-content mb-5" sx={{ boxShadow: 0 }}>
          <CardContent className="card-content mb-5" sx={{ boxShadow: 0 }}>
            <TableContainer className="table-container">
              <Table>
                <TableHead>
                  <TableRow className="custom-table-head">
                    <TableCell className="text-center">
                      {user.positions.status
                        ? "Người gửi đơn"
                        : "Người nhận đơn"}
                    </TableCell>
                    <TableCell className="text-center">Nội dung đơn </TableCell>
                    <TableCell className="text-center">Ngày gửi đơn </TableCell>
                    <TableCell className="text-center">
                      Trạng thái đơn
                    </TableCell>
                    {authState.user.positions.status === 1 ? (
                      <TableCell
                        className="text-center"
                        style={{ maxWidth: "100px" }}
                      ></TableCell>
                    ) : null}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataSingle && dataSingle.length > 0 ? (
                    dataSingle.map((row, index) => (
                      <React.Fragment key={index}>
                        <TableRow
                          onClick={() => handleToggleRow(row.id)}
                          style={{ background: "white" }}
                        >
                          <TableCell className="text-center">
                            {}
                            {user.positions.status === 1
                              ? row?.sender.name
                              : row?.approver.name}
                          </TableCell>

                          <TableCell className="text-center">
                            {row?.name} - lí do:
                            {row?.content &&
                              JSON.parse(row?.content).find(
                                (content) => content.key === "reason"
                              )?.value}
                          </TableCell>

                          <TableCell className="text-center">
                            {dateFormatter(row?.createdAt)}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.status === 0 ? (
                              <span className="badge badge-warning">
                                Đang chờ duyệt
                              </span>
                            ) : row.status === 1 ? (
                              <span className="badge badge-success">
                                Đơn đã chấp thuận
                              </span>
                            ) : (
                              <span className="badge badge-danger">
                                Đơn không được chấp thuận
                              </span>
                            )}
                          </TableCell>
                          {authState.user.positions.status === 1 &&
                          row.status === 0 ? (
                            <TableCell className="text-center">
                              <Update
                                handleGetList={handleGetList}
                                dataRow={row}
                              />
                            </TableCell>
                          ) : null}
                        </TableRow>
                      </React.Fragment>
                    ))
                  ) : (
                    <TableRow
                      key={1}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell align="center" colSpan={7}>
                        <div>
                          <span>Không có dữ liệu</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <div className="d-flex justify-content-between mt-2">
              <div>
                <div className="col d-flex align-self-center">
                  <span
                    style={{
                      marginTop: "1.5rem",
                      display: dataSingle.length > 0 ? "" : "none",
                    }}
                  >{`Hiển thị từ ${initIdPage} đến ${lastIdPage} trong tổng số ${totalRecord} kết quả`}</span>
                </div>
              </div>
              <div></div>
              <div>
                <Pagination
                  style={{
                    marginTop: "1.5rem",
                    float: "right",
                    display: dataSingle.length > 0 ? "" : "none",
                  }}
                  page={request.page}
                  count={Math.ceil(totalRecord / request.size)}
                  onChange={onPageClick}
                />
              </div>
            </div>
          </CardContent>
        </CardContent>
      </div>
    </div>
  );
};

export default Home;
