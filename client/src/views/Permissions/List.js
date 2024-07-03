import React, { useState, useEffect, useCallback } from "react";
import {
  // TextField,
  Button,
  // Box,
  // Autocomplete,
  // Tab,
  // Tabs,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  CardContent,
  Pagination,
  // Modal,
  debounce,
} from "@mui/material";
import Select from "react-select";
// import { MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import Create from "./Form/Create";
import { dateFormatter } from "../../utils/dateFormatter";
// import { FaTrash } from "react-icons/fa";
import Update from "./Form/Update";
import { apiGetPermission } from "../../service/api/listPermissions";

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

function ListPermissions(props) {
  // configure data
  const [request, setRequest] = useState({
    keySearch: "",
    page: 1,
    size: 10,
  });

  // configure data

  // phân trang

  const [rowsData, setRowsData] = useState([]);
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

  // Danh sách room
  const handleGetList = async () => {
    try {
      const result = await apiGetPermission(request);

      if (result.data.status === 200) {
        setRowsData(result.data.data);
        setTotalRecord(result.data.totalCount);
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
    handleGetList();
  }, [request]);

  return (
    <div className="wrapper-screen-list">
      <div className="top-content">
        <div className="row">
          <div className="col-md-2">
            <div className="text-left">
              <h3 className="heading-page text-uppercase">Quyền</h3>
            </div>
          </div>
          <div className="col-md-4 px-0">
            <div className="formSearch">
              <div>
                <input
                  type="text"
                  placeholder="Tên quyền"
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
        {/* <div className="col-md-2">
          <div className="filter-options">
            <label className="font-weight-bold">Thông tin chung</label>
          </div>
        </div> */}
        <div className="col-md-12 custom-col-child-padding pl-0">
          <CardContent className="card-content mb-5" sx={{ boxShadow: 0 }}>
            <TableContainer className="table-container">
              <Table>
                <TableHead>
                  <TableRow className="custom-table-head">
                    <TableCell className="text-center">Tên Quền</TableCell>
                    <TableCell className="text-center">Tài khoản</TableCell>
                    <TableCell className="text-center">Quyền</TableCell>
                    <TableCell className="text-center">Chức vụ</TableCell>
                    <TableCell className="text-center">Phòng ban</TableCell>
                    <TableCell className="text-center">Đơn</TableCell>
                    <TableCell className="text-center">Phê duyệt</TableCell>
                    <TableCell className="text-center">Trạng thái</TableCell>
                    <TableCell
                      className="text-center"
                      style={{ maxWidth: "100px" }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rowsData && rowsData.length > 0 ? (
                    rowsData.map((row, index) => (
                      <React.Fragment key={index}>
                        <TableRow
                          onClick={() => handleToggleRow(row.id)}
                          style={{ background: "white" }}
                        >
                          <TableCell className="text-center">
                            {row?.name}
                          </TableCell>

                          <TableCell className="text-center">
                            {row?.user.join(", ")}
                          </TableCell>

                          <TableCell className="text-center">
                            {row?.permission.join(", ")}
                          </TableCell>

                          <TableCell className="text-center">
                            {row?.position.join(", ")}
                          </TableCell>

                          <TableCell className="text-center">
                            {row?.room.join(", ")}
                          </TableCell>

                          <TableCell className="text-center">
                            {row?.single.join(", ")}
                          </TableCell>

                          <TableCell className="text-center">
                            {row?.singleType.join(", ")}
                          </TableCell>

                          <TableCell className="text-center">
                            {row?.status}
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
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
}

export default ListPermissions;
