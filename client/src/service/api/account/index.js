import axios from "axios";
import { apiUrl } from "../../../contexts/constants";

const apiUpdateAccount = async (data) => {
  return axios({
    method: "post",
    url: `${apiUrl}/users/updateAccount`,
    data: data,
  });
};

const apiUpdatePassword = async (data) => {
  return axios({
    method: "post",
    url: `${apiUrl}/users/changePassword`,
    data: data,
  });
};

const apiGetAccount = async (data) => {
  return axios({
    method: "get",
    url: `${apiUrl}/users/getAllUser`,
    params: data,
  });
};

const apiCreateAccount = async (data) => {
  return axios({
    method: "post",
    url: `${apiUrl}/users/register`,
    data: data,
  });
};
const apiUpdateUser = async (id, data) => {
  return axios({
    method: "put",
    url: `${apiUrl}/users/update/${id}`,
    data: data,
  });
};
const apiForgotpassword = async (data) => {
  return axios({
    method: "post",
    url: `${apiUrl}/users/forgotPassword`,
    data: data,
  });
};

export {
  apiUpdateAccount,
  apiUpdatePassword,
  apiGetAccount,
  apiCreateAccount,
  apiUpdateUser,
  apiForgotpassword,
};
