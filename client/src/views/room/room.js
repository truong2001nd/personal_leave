import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { apiGetRoom } from "../../service/api/room";

import "../../assets/style/room.css";
const Room = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState;

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await apiGetRoom(user.room._id);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };
    fetchRoomData();
  }, [user.room._id]);

  return (
    <div className="table-wrapper">
      <div className="border rounded shadow-sm p-4 bg-white">
        <div className="d-flex justify-content-between align-items-center ">
          <p className="text-left font-weight-bold">{user.room.name}</p>
          <div className="search-box">
            <input type="text" id="search-input" placeholder="Tìm kiếm..." />
            <button id="search-btn">Tìm</button>
          </div>
        </div>
      </div>

      <div>
        <div>
          <div className="col-12">
            <table className="table table-striped table-bordered table-dark-border">
              <thead>
                <tr>
                  <th className=" text-center fw-bold">STT</th>
                  <th>Họ và tên</th>
                  <th className=" text-center fw-bold">Ngày sinh</th>
                  <th>Thông tin liên lạc</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td className="align-middle text-center fw-bold">
                        {index}
                      </td>
                      <td>
                        <div className="item-info d-flex justify-content-between align-items-center">
                          <div>
                            <p className="fw-bold">{item.name}</p>
                            <p>{item.positions.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className=" text-center ">{item.birthday}</td>
                      <td>
                        <div className="item-info d-flex justify-content-between align-items-center">
                          <div>
                            <p>{item.email}</p>
                            <p>{item.phone}</p>
                          </div>
                          <div className="d-flex flex-column align-items-center">
                            <div
                              className="bg-dark rounded-circle mb-1"
                              style={{ width: "4px", height: "4px" }}
                            />
                            <div
                              className="bg-dark rounded-circle mb-1"
                              style={{ width: "4px", height: "4px" }}
                            />
                            <div
                              className="bg-dark rounded-circle"
                              style={{ width: "4px", height: "4px" }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2}>No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
