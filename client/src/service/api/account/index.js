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

export { apiUpdateAccount, apiUpdatePassword };
