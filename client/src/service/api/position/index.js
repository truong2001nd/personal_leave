import axios from "axios";
import { apiUrl } from "../../../contexts/constants";

const apiGetPosition = async (data) => {
  return axios({
    method: "get",
    url: `${apiUrl}/Position/getall`,
    params: data,
  });
};
const apiPostPosition = async (data) => {
  return axios({
    method: "post",
    url: `${apiUrl}/Position/create`,
    data: data,
  });
};

const apiUpdatePosition = async (id, data) => {
  return axios({
    method: "put",
    url: `${apiUrl}/Position/update/${id}`,
    data: data,
  });
};

export { apiGetPosition, apiPostPosition, apiUpdatePosition };
