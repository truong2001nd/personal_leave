import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { apiGetSingle, apiGetSingleType } from "../../service/api/single";
import {
  CardContent,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Table } from "react-bootstrap";
import Update from "../Position/Form/Update";
import { dateFormatter } from "../../utils/dateFormatter";

const Home = () => {
  const { authState } = useContext(AuthContext);
  const [dataFrom, setDataFrom] = useState([]);
  const [dataSingle, setSingle] = useState({});

  const [request, setRequest] = useState({
    keySearch: "",
    page: 1,
    size: 10,
    singlesStyes: "",
  });
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
  const handleGetlistSingle = async () => {
    try {
      console.log("result", request);
      const result = await apiGetSingle(request);
      setSingle(result.data.data);
    } catch (error) {
      console.log(error);
      toast.warning("Hệ thống đang bảo trì!");
    }
  };

  useEffect(() => {
    handleGetList();
  }, [request]);
  useEffect(() => {
    handleGetlistSingle();
  }, [request]);
  console.log(request);
  return (
    <div className="body-content row">
      <div className="top-content">
        <div className="row">
          <div className="col-md-2">
            <div className="text-left">
              <h3 className="heading-page text-uppercase">Đơn đã gửi</h3>
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
                      Người Nhận đơn
                    </TableCell>
                    <TableCell className="text-center">Nội dung đơn </TableCell>
                    <TableCell className="text-center">Ngày gửi đơn</TableCell>
                    <TableCell className="text-center"></TableCell>
                    <TableCell
                      className="text-center"
                      style={{ maxWidth: "100px" }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataSingle && dataSingle.length > 0 ? (
                    dataSingle.map((row, index) => (
                      <React.Fragment key={index}>
                        <TableRow
                          // onClick={() => handleToggleRow(row.id)}
                          style={{ background: "white" }}
                        >
                          <TableCell className="text-center">
                            {row?.approver.name}
                          </TableCell>

                          <TableCell className="text-center">
                            {row?.content &&
                              JSON.parse(row?.content).find(
                                (content) => content.key === "reason"
                              )?.value}
                          </TableCell>

                          <TableCell className="text-center">
                            {dateFormatter(row?.createdAt)}
                          </TableCell>

                          <TableCell className="text-center">
                            <Update
                              handleGetList={handleGetList}
                              dataRow={row}
                            />
                          </TableCell>
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

            {/* <div className="d-flex justify-content-between mt-2">
              <div>
                <div className="col d-flex align-self-center">
                  <span
                    style={{
                      marginTop: "1.5rem",
                      display: rowsData.length > 0 ? "" : "none",
                    }}
                  >{`Hiển thị từ ${initIdPage} đến ${lastIdPage} trong tổng số ${totalRecord} kết quả`}</span>
                </div>
              </div>
              <div>
                <div
                  className="col d-flex flex-row align-items-center align-items-center"
                  style={{
                    flexShrink: 0,
                    flexGrow: 1,
                    justifyContent: "center",
                    marginTop: "18px",
                  }}
                >
                  <span
                    className="px-2"
                    style={{
                      display: rowsData.length > 0 ? "" : "none",
                    }}
                  >
                    Hiển thị
                  </span>
                  <div
                    style={{
                      width: "90px",
                      display: rowsData.length > 0 ? "" : "none",
                    }}
                  >
                    <Select
                      menuPlacement="auto"
                      menuPosition="fixed"
                      options={listResultValues}
                      styles={customSelect}
                      onChange={handleChangeResultValue}
                      placeholder="10"
                    />
                  </div>
                  <span
                    className="px-2"
                    style={{
                      display: rowsData.length > 0 ? "" : "none",
                    }}
                  >
                    kết quả
                  </span>
                </div>
              </div>
              <div>
                <Pagination
                  style={{
                    marginTop: "1.5rem",
                    float: "right",
                    display: rowsData.length > 0 ? "" : "none",
                  }}
                  page={request.page}
                  count={Math.ceil(totalRecord / request.size)}
                  onChange={onPageClick}
                />
              </div>
            </div> */}
          </CardContent>
        </CardContent>
      </div>
    </div>
  );
};

export default Home;
