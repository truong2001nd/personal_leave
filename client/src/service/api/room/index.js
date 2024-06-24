import axios from "axios";
import { apiUrl } from "../../../contexts/constants";

const apiGetRoom = async (data) => {
  return axios({
    method: "get",
    url: `${apiUrl}/room/getAll`,
    params: data,
  });
};
const apiGetRoomUserApprove = async (id) => {
  return axios({
    method: "get",
    url: `${apiUrl}/room/getRoomUserApprove/${id}`,
  });
};
const apiGetRoomUser = async (id) => {
  return axios({
    method: "get",
    url: `${apiUrl}/room/getRoomUser/${id}`,
  });
};
const apiPostRoom = async (data) => {
  return axios({
    method: "post",
    url: `${apiUrl}/room/create`,
    data: data,
  });
};
const apiDeleteRoom = async (id) => {
  return axios({
    method: "delete",
    url: `${apiUrl}/room/deleteRoom/${id}`,
  });
};
const apiUpdateRoom = async (id, data) => {
  return axios({
    method: "put",
    url: `${apiUrl}/room/update/${id}`,
    data: data,
  });
};

export {
  apiGetRoom,
  apiPostRoom,
  apiDeleteRoom,
  apiUpdateRoom,
  apiGetRoomUserApprove,
  apiGetRoomUser,
};
