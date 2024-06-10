import axios from "axios";
import { apiUrl } from "../../../contexts/constants";

const apiGetPermission = async (data) => {
  return axios({
    method: "get",
    url: `${apiUrl}/permission/getAll`,
    params: data,
  });
};
const apiPostPermission = async (data) => {
  return axios({
    method: "post",
    url: `${apiUrl}/permission/create`,
    data: data,
  });
};

const apiUpdatePermission = async (id, data) => {
  return axios({
    method: "put",
    url: `${apiUrl}/permission/update/${id}`,
    data: data,
  });
};

export { apiGetPermission, apiPostPermission, apiUpdatePermission };
