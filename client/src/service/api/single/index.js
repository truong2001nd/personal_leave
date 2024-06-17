import axios from "axios";
import { apiUrl } from "../../../contexts/constants";

// get loại đơn
const apiGetSingleType = async (data) => {
  return axios({
    method: "get",
    url: `${apiUrl}/singleType/getAll`,
    params: data,
  });
};
// get đơn
const apiGetSingle = async (data) => {
  return axios({
    method: "get",
    url: `${apiUrl}/single/getAll`,
    params: data,
  });
};
const apiPostSingleType = async (data) => {
  return axios({
    method: "post",
    url: `${apiUrl}/single/create`,
    data: data,
  });
};
const apiDeleteRoom = async (id) => {
  return axios({
    method: "delete",
    url: `${apiUrl}/room/deleteRoom/${id}`,
  });
};
const apiUpdateApproval = async (id, data) => {
  return axios({
    method: "put",
    url: `${apiUrl}/single/approval/${id}`,
    data: data,
  });
};

export {
  apiGetSingleType,
  apiGetSingle,
  apiPostSingleType,
  apiDeleteRoom,
  apiUpdateApproval,
};
