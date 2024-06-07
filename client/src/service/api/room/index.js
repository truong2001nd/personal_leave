import axios from "axios";
import { apiUrl } from "../../../contexts/constants";

const apiGetRoom = async (Id) => {
  return axios({
    method: "get",
    url: `${apiUrl}/room/getOne/${Id}`,
  });
};

export { apiGetRoom };
