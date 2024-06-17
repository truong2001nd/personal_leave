import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  CardContent,
  Pagination,
  debounce,
} from "@mui/material";
import Select from "react-select";
import { toast } from "react-toastify";
import Create from "./Form/Create";
import Update from "./Form/Update";
import { apiGetRoom } from "../../service/api/room";
import { apiGetAccount } from "../../service/api/account";
import { apiGetPosition } from "../../service/api/position";
import { apiGetPermission } from "../../service/api/listPermissions";
import Forgotpassword from "./Form/Forgotpassword";

const customSelect = {
  control: (base) => ({
    ...base,
    height: 35,
    minHeight: 35,
  }),
};

const listResultValues = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "30", label: "30" },
  { value: "50", label: "50" },
];

function ListAccountManagement(props) {
  // configure data
  const [request, setRequest] = useState({
    keySearch: "",
    page: 1,
    size: 10,
    room: "",
    positions: "",
    permissions: "",
  });

  const [listAccount, setListAccount] = useState([]);
  const [listRoom, setListRoom] = useState([]);
  const [listPositions, setListPositions] = useState([]);
  const [listPermission, setListPermission] = useState([]);
  // configure data

  // phân trang

  const [initIdPage, setInitIdPage] = useState(0);
  const [lastIdPage, setLastIdPage] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);

  const handleChangeResultValue = (data) => {
    setRequest({ ...request, size: data.value, page: 1 });
  };

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

  const [expandedRow, setExpandedRow] = useState(null);
  const handleToggleRow = (rowId) => {
    if (expandedRow === rowId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(rowId);
    }
  };

  // phân trang

  // call api

  // Danh sách tài khoản
  const handleGetList = async (url) => {
    try {
      const result = await apiGetAccount(url);
      if (result.data.status === 200) {
        setListAccount(result.data.data);
        setTotalRecord(result.data.totalCount);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.warning("Hệ thống đang bảo trì!");
    }
  };

  const handleGetPosition = async () => {
    try {
      const result = await apiGetPosition({
        keySearch: "",
        page: 1,
        size: 100,
      });
      if (result.data.status === 200) {
        setListPositions(result.data.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.warning("Hệ thống đang bảo trì!");
    }
  };
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
  const handleGetPermission = async () => {
    try {
      const result = await apiGetPermission({
        keySearch: "",
        page: 1,
        size: 100,
      });
      if (result.data.status === 200) {
        setListPermission(result.data.data);
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

  // tìm kiếm công ty
  const handleOnChangeSearch = useCallback(
    debounce((value) => {
      setRequest({ ...request, keySearch: value, page: 1 });
    })
  );

  //event handler

  useEffect(() => {
    handleGetList(request);
  }, [request]);

  useEffect(() => {
    handleGetListRoom();
    handleGetPosition();
    handleGetPermission();
  }, []);
  return (
    <div className="wrapper-screen-list">
      <div className="top-content">
        <div className="row">
          <div className="col-md-2">
            <div className="text-left">
              <h4 className="heading-page text-uppercase">
                Quản lý tài khoản người dùng
              </h4>
            </div>
          </div>
          <div className="col-md-4 px-0">
            <div className="formSearch">
              <div>
                <input
                  type="text"
                  placeholder="Tên nhân viên"
                  className="inputSearch"
                  onChange={(e) => handleOnChangeSearch(e.target.value)}
                />
                <button type="button" className="iconSearch pl-2">
                  <i className="mdi mdi-magnify"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex justify-content-end">
              <Create handleGetList={handleGetList} />
              <Forgotpassword handleGetList={handleGetList} />

              <Button
                onClick={() => {
                  window.location.reload();
                }}
                type="button"
                variant="contained"
                color="error"
                className="ml-2"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="body-content row">
        <div className="col-md-2">
          <div className="filter-options">
            <label className="font-weight-bold">Thông tin chung</label>

            <select
              className="form-select"
              value={request.room}
              name="room"
              onChange={(e) => {
                setRequest((prev) => {
                  return {
                    ...prev,
                    room: e.target.value,
                    page: 1,
                  };
                });
              }}
            >
              <option value="">Chọn phòng ban</option>
              {listRoom &&
                listRoom.map((department, index) => (
                  <option key={index} value={department._id}>
                    {department.name}
                  </option>
                ))}
            </select>
            <select
              className="form-select mt-2"
              value={request.positions}
              name="positions"
              onChange={(e) => {
                setRequest((prev) => {
                  return {
                    ...prev,
                    positions: e.target.value,
                    page: 1,
                  };
                });
              }}
            >
              <option value="">Chọn chức vụ</option>
              {listPositions &&
                listPositions.map((department, index) => (
                  <option key={index} value={department._id}>
                    {department.name}
                    <span> - Phòng ban: {department.room.name}</span>
                  </option>
                ))}
            </select>
            <select
              className="form-select mt-2"
              value={request.permission}
              name="permission"
              onChange={(e) => {
                setRequest((prev) => {
                  return {
                    ...prev,
                    permission: e.target.value,
                    page: 1,
                  };
                });
              }}
            >
              <option value="">Chọn Quyền</option>
              {listPermission &&
                listPermission.map((department, index) => (
                  <option key={index} value={department._id}>
                    {department.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        <div className="col-md-10 custom-col-child-padding pl-0">
          <CardContent className="card-content mb-5" sx={{ boxShadow: 0 }}>
            <TableContainer className="table-container">
              <Table>
                <TableHead>
                  <TableRow className="custom-table-head">
                    <TableCell className="text-center">Tên nhân viên</TableCell>
                    <TableCell className="text-center">Eamil</TableCell>
                    <TableCell className="text-center">Chức vụ</TableCell>
                    <TableCell className="text-center">Phòng ban</TableCell>
                    <TableCell className="text-center">Phòng Quyền</TableCell>
                    <TableCell
                      className="text-center"
                      style={{ maxWidth: "100px" }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listAccount && listAccount.length > 0 ? (
                    listAccount.map((row, index) => (
                      <React.Fragment key={index}>
                        <TableRow
                          onClick={() => handleToggleRow(row.id)}
                          style={{ background: "white" }}
                        >
                          <TableCell className="text-center">
                            {row?.name}
                          </TableCell>

                          <TableCell className="text-center">
                            {row?.email}
                          </TableCell>

                          <TableCell className="text-center">
                            {row?.positions.name}
                          </TableCell>
                          <TableCell className="text-center">
                            {row?.positions.room.name}
                          </TableCell>
                          <TableCell className="text-center">
                            {row?.permissions.name}
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

            <div className="d-flex justify-content-between mt-2">
              <div>
                <div className="col d-flex align-self-center">
                  <span
                    style={{
                      marginTop: "1.5rem",
                      display: listAccount.length > 0 ? "" : "none",
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
                      display: listAccount.length > 0 ? "" : "none",
                    }}
                  >
                    Hiển thị
                  </span>
                  <div
                    style={{
                      width: "90px",
                      display: listAccount.length > 0 ? "" : "none",
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
                      display: listAccount.length > 0 ? "" : "none",
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
                    display: listAccount.length > 0 ? "" : "none",
                  }}
                  page={request.page}
                  count={Math.ceil(totalRecord / request.size)}
                  onChange={onPageClick}
                />
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
}

export default ListAccountManagement;
