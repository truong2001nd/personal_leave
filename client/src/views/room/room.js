import React from "react";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import {
  apiGetRoom,
  apiPostRoom,
  apiDeleteRoom,
  apiUpdateRoom,
} from "../../service/api/room";

import "../../assets/style/room.css";

const Room = () => {
  const [dataRoom, setDataRoom] = useState([]);
  const [dataSearch, setDataSearch] = useState("");
  const [createRoom, setCreateRoom] = useState({
    name: "",
    description: "",
  });
  const [updateRoom, setUpdateRoom] = useState({
    newName: "",
    newDescription: "",
    idRoom: "",
  });
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  const handleChangeFromData = (name, value, data) => {
    data((prev) => {
      return { ...prev, [name]: value };
    });
  };
  function handleCreateRoom() {
    setShowCreate(true);
  }
  const fetchRoomData = async (search) => {
    try {
      const response = await apiGetRoom(search);
      setDataRoom(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống bảo trì!");
    }
  };
  useEffect(() => {
    fetchRoomData("");
  }, []);

  const handleClickSearch = () => {
    fetchRoomData(`?search=${dataSearch}`);
  };
  const handleClickCreate = async () => {
    try {
      const response = await apiPostRoom(createRoom);
      if (response.data.status === 200) {
        fetchRoomData("");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống bảo trì!");
    }
  };

  const handleDeleteRoom = async (data) => {
    try {
      const response = await apiDeleteRoom(data._id);
      if (response.data.status === 200) {
        fetchRoomData("");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống bảo trì!");
    }
  };
  const handleUpdateRoom = (data) => {
    setShowUpdate(true);
    setUpdateRoom({
      newName: data.name,
      newDescription: data.description,
      idRoom: data._id,
    });
  };

  const handleClickUpdate = async () => {
    try {
      const newRoom = {
        name: updateRoom.newName,
        description: updateRoom.newDescription,
      };
      const response = await apiUpdateRoom(updateRoom.idRoom, newRoom);
      if (response.data.status === 200) {
        fetchRoomData("");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Hệ thống bảo trì!");
    }
  };

  return (
    <div className="table-wrapper">
      <div className="content-crud-container">
        <div className="content-crud-left">
          <div className="content-read">
            <input
              type="text"
              id="search-input"
              value={dataSearch}
              placeholder="Tìm kiếm..."
              onChange={(e) => {
                setDataSearch(e.target.value);
              }}
            />
            <button
              className="btn btn-primary ms-2"
              onClick={handleClickSearch}
            >
              Tìm kiếm
            </button>
          </div>
        </div>
        <div className="content-crud-right">
          <button className="btn btn-primary ms-2" onClick={handleCreateRoom}>
            Thêm
          </button>
        </div>
      </div>

      <div>
        <div>
          <div className="col-12">
            <table className="table table-striped table-bordered table-dark-border">
              <thead>
                <tr>
                  <th className=" text-center fw-bold col-1">STT</th>
                  <th className=" text-center fw-bold col-1">Tên phòng ban</th>
                  <th className=" text-center fw-bold col-5">Chi tiết</th>
                  <th className=" text-center fw-bold col-2">Ngày Tạo </th>
                  <th className=" text-center fw-bold col-2">Ngày chỉnh sửa</th>
                  <th className=" text-center fw-bold col-1">Xóa và sửa</th>
                </tr>
              </thead>
              <tbody>
                {dataRoom.length > 0 ? (
                  dataRoom.map((item, index) => (
                    <tr key={index}>
                      <td className="align-middle text-center fw-bold">
                        {index}
                      </td>
                      <td>
                        <div className="item-info d-flex justify-content-between align-items-center">
                          <div>
                            <p className="fw-bold">{item.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className=" text-center ">{item.description}</td>
                      <td>
                        <div className="item-info d-flex justify-content-between align-items-center">
                          <div>
                            <p>{item.createdAt}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="item-info d-flex justify-content-between align-items-center">
                          <div>
                            <p>{item.updatedAt}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="item-info d-flex justify-content-between align-items-center ">
                          <div style={{ display: "flex" }}>
                            <button
                              className="btn btn-danger ms-2 "
                              onClick={() => {
                                handleDeleteRoom(item);
                              }}
                            >
                              Xóa
                            </button>
                            <button
                              className="btn btn-warning ms-2"
                              onClick={() => {
                                handleUpdateRoom(item);
                              }}
                            >
                              Sửa
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2}>Tên phòng không đúng </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Tạo phòng ban */}
      <Modal size="lg" show={showCreate} onHide={setShowCreate}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo phòng ban</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="name">Tên phòng ban</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Nhập Phòng ban"
                name="name"
                value={createRoom.name}
                onChange={(e) =>
                  handleChangeFromData("name", e.target.value, setCreateRoom)
                }
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
                value={createRoom.description}
                onChange={(e) =>
                  handleChangeFromData(
                    "description",
                    e.target.value,
                    setUpdateRoom
                  )
                }
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowCreate(false);
            }}
          >
            Hủy
          </Button>
          <Button variant="primary" onClick={handleClickCreate}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal size="lg" show={showUpdate} onHide={setShowUpdate}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật phòng ban</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="newName">Tên phòng ban</label>
              <input
                type="text"
                className="form-control"
                id="newName"
                placeholder="Nhập Phòng ban"
                name="newName"
                value={updateRoom.newName}
                onChange={(e) =>
                  handleChangeFromData("newName", e.target.value, setUpdateRoom)
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="newDescription">
                Nội dung chi tiết phòng ban
              </label>
              <input
                type="text"
                className="form-control"
                id="newDescription"
                placeholder="Nhập mật nội dung"
                name="newDescription"
                value={updateRoom.newDescription}
                onChange={(e) =>
                  handleChangeFromData(
                    "newDescription",
                    e.target.value,
                    setUpdateRoom
                  )
                }
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowUpdate(false);
            }}
          >
            Hủy
          </Button>
          <Button variant="primary" onClick={handleClickUpdate}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Room;
