import axios from "axios";
import { apiUrl } from "../../../contexts/constants";

const apiGetRoom = async (search) => {
  return axios({
    method: "get",
    url: `${apiUrl}/room/getAll${search}`,
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

export { apiGetRoom, apiPostRoom, apiDeleteRoom, apiUpdateRoom };
